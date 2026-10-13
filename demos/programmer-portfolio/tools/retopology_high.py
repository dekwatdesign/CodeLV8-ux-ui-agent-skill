"""Connected torso/arm retopology, editable control cage and high-poly export."""
import bpy, bmesh, math, os, json, shutil, contextlib, io
from mathutils import Vector
ROOT='D:/Projects/CodeLV8-ux-ui-agent-skill/demos/programmer-portfolio'
scene=bpy.context.scene
assert scene.name=='Portfolio Studio'
assert scene.get('character_retopology_v1'), 'Run character retopology v1 first'
assert not scene.get('character_retopology_high'), 'High topology already applied'
scene.frame_set(1);bpy.context.view_layer.update()
backup='D:/Projects/CodeLV8-ux-ui-agent-skill/output/blender-backups/retopology-high-before'
os.makedirs(backup,exist_ok=True)
for filename in ['studio.blend','studio.glb','studio-preview.png']:
    if not os.path.exists(backup+'/'+filename):shutil.copy2(ROOT+'/assets/'+filename,backup+'/'+filename)
bpy.ops.wm.save_as_mainfile(filepath=backup+'/live-session.blend',copy=True)
archive=bpy.data.collections.new('High Retopology Sources');scene.collection.children.link(archive)
archive.hide_render=True;archive.hide_viewport=True
body=scene.objects['Sweatshirt'];matrix=body.matrix_world.copy();inverse=matrix.inverted()
vertices,faces,lookup=[],[],{}
divisions=12
def index(coords):
    key=tuple(coords)
    if key not in lookup:
        x,y,z=[value/divisions for value in coords]
        p=Vector((x*math.sqrt(1-y*y/2-z*z/2+y*y*z*z/3),
                  y*math.sqrt(1-z*z/2-x*x/2+z*z*x*x/3),
                  z*math.sqrt(1-x*x/2-y*y/2+x*x*y*y/3)))
        lookup[key]=len(vertices);vertices.append(matrix@p)
    return lookup[key]
grids={}
for axis in range(3):
    other=[i for i in range(3) if i!=axis]
    for sign in [-1,1]:
        grid={}
        for row in range(divisions+1):
            for col in range(divisions+1):
                coords=[0,0,0];coords[axis]=sign*divisions
                coords[other[0]]=-divisions+2*col;coords[other[1]]=-divisions+2*row
                grid[col,row]=index(coords)
        grids[axis,sign]=grid
        for row in range(divisions):
            for col in range(divisions):
                # Shoulder ports share vertices with the surrounding torso cage.
                if axis==0 and 4<=col<8 and 7<=row<11:continue
                faces.append([grid[col,row],grid[col+1,row],grid[col+1,row+1],grid[col,row+1]])
perimeter=([(col,0) for col in range(4)]+[(4,row) for row in range(4)]
           +[(col,4) for col in range(4,0,-1)]+[(0,row) for row in range(4,0,-1)])
def catmull(points,segment,t):
    p0=points[max(0,segment-1)];p1=points[segment];p2=points[segment+1];p3=points[min(len(points)-1,segment+2)]
    return .5*(2*p1+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t)
def disk(col,row):
    u=-1+col/2;v=-1+row/2
    return Vector((u*math.sqrt(1-v*v/2),v*math.sqrt(1-u*u/2),0))
for sign in [-1,1]:
    grid=grids[0,sign]
    previous=[grid[col+4,row+7] for col,row in perimeter]
    center=sum((vertices[i] for i in previous),Vector())/16
    controls=[center,Vector((sign*.375,-.49,1.405)),Vector((sign*.38,-.30,1.13)),Vector((sign*.3135,.17,1.37))]
    centers=[];radius=[]
    values=[.113,.108,.101,.071]
    for segment in range(3):
        for step in range(1,9):
            t=step/8;centers.append(catmull(controls,segment,t));radius.append(values[segment]*(1-t)+values[segment+1]*t)
    prior_center=center
    last_order=None;last_orientation=None
    for ring,center in enumerate(centers):
        tangent=centers[min(ring+1,len(centers)-1)]-prior_center
        orientation=tangent.to_track_quat('Z','Y')
        candidates=[center+orientation@(disk(col,row)*radius[ring]) for col,row in perimeter]
        choices=[]
        for reverse in ([False,True] if ring==0 else [last_order[0]]):
            sequence=list(range(16)) if not reverse else list(reversed(range(16)))
            for shift in range(16):
                order=sequence[shift:]+sequence[:shift]
                cost=sum((vertices[previous[j]]-candidates[order[j]]).length_squared for j in range(16))
                choices.append((cost,reverse,order))
        _,reverse,order=min(choices,key=lambda v:v[0])
        current=[]
        for j in order:current.append(len(vertices));vertices.append(candidates[j])
        for j in range(16):faces.append([previous[j],previous[(j+1)%16],current[(j+1)%16],current[j]])
        previous=current;prior_center=center;last_order=(reverse,order);last_orientation=orientation
    # Close the cuff with an all-quad disk using the same boundary vertices.
    cap={perimeter[order[j]]:previous[j] for j in range(16)}
    for row in range(1,4):
        for col in range(1,4):
            cap[col,row]=len(vertices);vertices.append(centers[-1]+last_orientation@(disk(col,row)*radius[-1]))
    for row in range(4):
        for col in range(4):faces.append([cap[col,row],cap[col+1,row],cap[col+1,row+1],cap[col,row+1]])
# Remove vertices left inside the cut shoulder patches.
used=sorted({v for face in faces for v in face});remap={old:new for new,old in enumerate(used)}
mesh=bpy.data.meshes.new('Connected torso shoulders elbows wrists quad cage')
mesh.from_pydata([tuple(inverse@vertices[i]) for i in used],[],[[remap[v] for v in face] for face in faces]);mesh.update()
bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
assert all(len(e.link_faces)==2 for e in bm.edges),'Body is not closed manifold'
assert all(len(f.verts)==4 and f.calc_area()>1e-9 for f in bm.faces),'Invalid quad face'
unseen=set(bm.verts);components=0
while unseen:
    components+=1;stack=[unseen.pop()]
    while stack:
        for e in stack.pop().link_edges:
            for v in e.verts:
                if v in unseen:unseen.remove(v);stack.append(v)
assert components==1,'Torso and arms are disconnected'
bm.to_mesh(mesh);bm.free()
source=body.copy();source.data=body.data.copy();source.name='High source Sweatshirt';archive.objects.link(source)
for material in body.data.materials:mesh.materials.append(material)
body.data=mesh
for p in mesh.polygons:p.use_smooth=True
for name in ['Upper sleeve','Upper sleeve.001']:
    obj=scene.objects[name]
    for collection in list(obj.users_collection):collection.objects.unlink(obj)
    archive.objects.link(obj);obj.name='High source '+name
primary=['Sweatshirt','Head','Hair cap','Typing hand L','Typing hand R']
for name in primary:
    obj=scene.objects[name]
    modifier=next(m for m in obj.modifiers if m.type=='SUBSURF')
    modifier.levels=3;modifier.render_levels=3
scene['character_retopology_high']=True
bpy.context.view_layer.update()
report={'body_base_quads':len(mesh.polygons),'body_base_vertices':len(mesh.vertices),'body_connected_components':components,
        'body_closed_manifold':True,'body_all_quads':True,'high_subdivision':3,'objects':[],'backup':backup}
for name in primary:
    obj=scene.objects[name];evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    report['objects'].append({'object':name,'base_faces':len(obj.data.polygons),'high_faces':len(evaluated.data.polygons),'high_vertices':len(evaluated.data.vertices)})
# Preserve object animation contracts and screen-facing direction.
for name in ['Head motion','Typing hand L','Typing hand R']:assert scene.objects[name].animation_data is not None
face=scene.objects['Nose'].matrix_world.translation-scene.objects['Head'].matrix_world.translation
target=scene.objects['Monitor'].matrix_world.translation-scene.objects['Head'].matrix_world.translation
face.z=0;target.z=0;assert face.normalized().dot(target.normalized())>.99
bpy.ops.object.select_all(action='DESELECT')
for obj in scene.objects:
    archived=any(c.name in ['Character Retopology Sources','High Retopology Sources'] for c in obj.users_collection)
    if not archived and (obj.type=='MESH' or obj.name=='Head motion'):obj.select_set(True)
def export(filename):
    with contextlib.redirect_stdout(io.StringIO()):
        bpy.ops.export_scene.gltf(filepath=ROOT+'/assets/'+filename,export_format='GLB',use_selection=True,export_apply=True,export_animations=True,export_animation_mode='SCENE')
export('studio.glb')
report['high_glb_bytes']=os.path.getsize(ROOT+'/assets/studio.glb')
for name in primary:next(m for m in scene.objects[name].modifiers if m.type=='SUBSURF').levels=2
export('studio-mobile.glb')
report['mobile_glb_bytes']=os.path.getsize(ROOT+'/assets/studio-mobile.glb')
for name in primary:next(m for m in scene.objects[name].modifiers if m.type=='SUBSURF').levels=3
with contextlib.redirect_stdout(io.StringIO()):
    bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/studio.blend',copy=True)
    scene.render.filepath=ROOT+'/assets/studio-preview.png';bpy.ops.render.render(write_still=True)
with open(ROOT+'/evidence/retopology-high.json','w',encoding='utf-8') as f:json.dump(report,f,indent=2)
print(json.dumps(report))
