"""Focused all-quad character refinement. Run against Portfolio Studio in Blender."""
import bpy, bmesh, math, os, json, shutil, contextlib, io
from mathutils import Vector

ROOT = 'D:/Projects/CodeLV8-ux-ui-agent-skill/demos/programmer-portfolio'
scene = bpy.context.scene
assert scene.name == 'Portfolio Studio', 'Expected Portfolio Studio scene'
assert not scene.get('character_retopology_v1'), 'Character retopology v1 already applied'
scene.frame_set(1)
bpy.context.view_layer.update()
backup = 'D:/Projects/CodeLV8-ux-ui-agent-skill/output/blender-backups/retopology-v1-before'
os.makedirs(backup, exist_ok=True)
for filename in ['studio.blend', 'studio.glb', 'studio-preview.png']:
    destination = backup + '/' + filename
    if os.path.exists(ROOT + '/assets/' + filename) and not os.path.exists(destination):
        shutil.copy2(ROOT + '/assets/' + filename, destination)
bpy.ops.wm.save_as_mainfile(filepath=backup + '/live-session.blend', copy=True)
archive = bpy.data.collections.new('Character Retopology Sources')
scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
report = []

def preserve(obj):
    source = obj.copy()
    source.data = obj.data.copy()
    source.name = 'Retopo source ' + obj.name
    archive.objects.link(source)
    return source

def mesh_data(name, vertices, faces):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    bm = bmesh.new(); bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    assert all(len(edge.link_faces) == 2 for edge in bm.edges), name + ': non-manifold edge'
    assert all(len(face.verts) == 4 for face in bm.faces), name + ': non-quad face'
    assert all(face.calc_area() > 1e-9 for face in bm.faces), name + ': degenerate face'
    bm.to_mesh(mesh); bm.free()
    for polygon in mesh.polygons: polygon.use_smooth = True
    return mesh

def quad_sphere(name, divisions=8):
    vertices, faces, lookup = [], [], {}
    def index(coords):
        key = tuple(coords)
        if key not in lookup:
            x, y, z = [value / divisions for value in coords]
            # Equalized cube-to-sphere mapping avoids UV-sphere triangle poles.
            point = (x * math.sqrt(1-y*y/2-z*z/2+y*y*z*z/3),
                     y * math.sqrt(1-z*z/2-x*x/2+z*z*x*x/3),
                     z * math.sqrt(1-x*x/2-y*y/2+x*x*y*y/3))
            lookup[key] = len(vertices); vertices.append(point)
        return lookup[key]
    for axis in range(3):
        others = [i for i in range(3) if i != axis]
        for sign in [-1, 1]:
            grid = {}
            for row in range(divisions+1):
                for col in range(divisions+1):
                    coords = [0, 0, 0]; coords[axis] = sign*divisions
                    coords[others[0]] = -divisions+2*col
                    coords[others[1]] = -divisions+2*row
                    grid[col, row] = index(coords)
            for row in range(divisions):
                for col in range(divisions):
                    faces.append([grid[col,row],grid[col+1,row],grid[col+1,row+1],grid[col,row+1]])
    return mesh_data(name, vertices, faces)

def replace(obj, mesh):
    before = {'vertices':len(obj.data.vertices), 'faces':len(obj.data.polygons)}
    preserve(obj)
    for material in obj.data.materials: mesh.materials.append(material)
    obj.data = mesh
    modifier = obj.modifiers.new('Character surface refinement', 'SUBSURF')
    modifier.levels = 1; modifier.render_levels = 1
    report.append({'object':obj.name, 'before':before, 'base_vertices':len(mesh.vertices),
                   'base_quads':len(mesh.polygons), 'subdivision':1, 'closed_manifold':True})

for name in ['Head', 'Hair cap', 'Sweatshirt', 'Typing hand L', 'Typing hand R']:
    obj = scene.objects[name]
    replace(obj, quad_sphere(name+' quad cage'))

def arm_mesh(name, shoulder, elbow, wrist, matrix):
    # Continuous ring sweep, with quad disk caps sharing perimeter vertices.
    points = [Vector(shoulder), Vector(elbow), Vector(wrist)]
    centers, radii = [], []
    steps = 10
    for segment in range(2):
        p0 = points[max(0,segment-1)]; p1=points[segment]
        p2 = points[segment+1]; p3=points[min(2,segment+2)]
        for step in range(steps+(1 if segment==1 else 0)):
            t=step/steps
            center=.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t)
            centers.append(center)
            radius_pair = (.112,.10) if segment==0 else (.10,.071)
            radii.append(radius_pair[0]*(1-t)+radius_pair[1]*t)
    divisions=4
    perimeter = ([(col,0) for col in range(divisions)]
                 +[(divisions,row) for row in range(divisions)]
                 +[(col,divisions) for col in range(divisions,0,-1)]
                 +[(0,row) for row in range(divisions,0,-1)])
    def disk(col,row):
        u=-1+2*col/divisions; v=-1+2*row/divisions
        return Vector((u*math.sqrt(1-v*v/2), v*math.sqrt(1-u*u/2), 0))
    vertices,faces,frames=[],[],[]
    inverse=matrix.inverted()
    for i,center in enumerate(centers):
        tangent=centers[min(i+1,len(centers)-1)]-centers[max(i-1,0)]
        orientation=tangent.to_track_quat('Z','Y'); frames.append(orientation)
        for col,row in perimeter:
            vertices.append(tuple(inverse @ (center+orientation @ (disk(col,row)*radii[i]))))
    count=len(perimeter)
    for ring in range(len(centers)-1):
        for j in range(count):
            faces.append([ring*count+j,ring*count+(j+1)%count,(ring+1)*count+(j+1)%count,(ring+1)*count+j])
    for ring in [0,len(centers)-1]:
        grid={pair:ring*count+i for i,pair in enumerate(perimeter)}
        for row in range(1,divisions):
            for col in range(1,divisions):
                grid[col,row]=len(vertices)
                vertices.append(tuple(inverse @ (centers[ring]+frames[ring] @ (disk(col,row)*radii[ring]))))
        for row in range(divisions):
            for col in range(divisions):
                faces.append([grid[col,row],grid[col+1,row],grid[col+1,row+1],grid[col,row+1]])
    return mesh_data(name,vertices,faces)

for x,suffix in [(-.19,''),(.19,'.001')]:
    sleeve=scene.objects['Upper sleeve'+suffix]
    mesh=arm_mesh('Continuous sleeve'+suffix,(x*1.6,-.52,1.45),(x*2,-.30,1.13),(x*1.65,.17,1.37),sleeve.matrix_world)
    replace(sleeve,mesh)
    # Preserve the old disconnected segment in an excluded source collection.
    old_forearm=scene.objects['Forearm'+suffix]
    for collection in list(old_forearm.users_collection): collection.objects.unlink(old_forearm)
    archive.objects.link(old_forearm);old_forearm.name='Retopo source '+old_forearm.name

bpy.context.view_layer.update()
scene['character_retopology_v1']=True
face=scene.objects['Nose'].matrix_world.translation-scene.objects['Head'].matrix_world.translation
target=scene.objects['Monitor'].matrix_world.translation-scene.objects['Head'].matrix_world.translation
face.z=0;target.z=0
assert face.normalized().dot(target.normalized())>.99, 'Head direction changed'
for name in ['Typing hand L','Typing hand R','Head motion']:
    assert scene.objects[name].animation_data is not None, name+': animation missing'
for item in report:
    obj=scene.objects[item['object']];evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    item['evaluated_faces']=len(evaluated.data.polygons)
    item['evaluated_vertices']=len(evaluated.data.vertices)

bpy.ops.object.select_all(action='DESELECT')
for obj in scene.objects:
    if archive not in obj.users_collection and (obj.type=='MESH' or obj.name=='Head motion'):
        obj.select_set(True)
with contextlib.redirect_stdout(io.StringIO()):
    bpy.ops.export_scene.gltf(filepath=ROOT+'/assets/studio.glb',export_format='GLB',use_selection=True,export_apply=True,export_animations=True,export_animation_mode='SCENE')
    bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/studio.blend',copy=True)
    scene.render.filepath=ROOT+'/assets/studio-preview.png'
    bpy.ops.render.render(write_still=True)
result={'objects':report,'glb_bytes':os.path.getsize(ROOT+'/assets/studio.glb'),
        'head_facing_monitor':True,'animation_targets_preserved':True,'backup':backup}
os.makedirs(ROOT+'/evidence',exist_ok=True)
with open(ROOT+'/evidence/retopology.json','w',encoding='utf-8') as file:json.dump(result,file,indent=2)
print(json.dumps(result))
