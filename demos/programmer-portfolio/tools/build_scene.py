"""Run in Blender via MCP; creates a separate scene and original models."""
import bpy, math, os
from mathutils import Vector

ROOT = 'D:/Projects/CodeLV8-ux-ui-agent-skill/demos/programmer-portfolio'
os.makedirs(ROOT + '/assets', exist_ok=True)
assert 'Portfolio Studio' not in bpy.data.scenes, 'Portfolio Studio already exists; edit the existing scene instead of duplicating it.'
BACKUP = 'D:/Projects/CodeLV8-ux-ui-agent-skill/output/blender-backups'
os.makedirs(BACKUP, exist_ok=True)
if not os.path.exists(BACKUP + '/portfolio-original-session.blend'):
    bpy.ops.wm.save_as_mainfile(filepath=BACKUP + '/portfolio-original-session.blend', copy=True)
scene = bpy.data.scenes.new('Portfolio Studio')
bpy.context.window.scene = scene
scene.render.fps = 24
scene.frame_start, scene.frame_end = 1, 97
def mat(name, color, emission=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=.65
    if emission:
        p.inputs['Emission Color'].default_value=(*color,1); p.inputs['Emission Strength'].default_value=emission
    return m
cream=mat('Warm plaster',(.77,.73,.65)); floor=mat('Midnight teal',(.10,.24,.26))
wood=mat('Honey oak',(.57,.31,.15)); dark=mat('Graphite',(.025,.04,.055)); green=mat('Sage',(.20,.38,.28))
skin=mat('Warm skin',(.72,.42,.25)); shirt=mat('Ivory sweatshirt',(.85,.83,.72)); blue=mat('Denim',(.11,.19,.27))
white=mat('Warm white',(.94,.94,.86)); screenmat=mat('Screen navy',(.018,.045,.075)); mint=mat('Code mint',(.24,.88,.70),1.8)
purple=mat('Code lilac',(.63,.43,.91),1.2); gold=mat('Amber light',(.96,.58,.16),2)
def finish(o,name,material):
    o.name=name; o.data.materials.append(material)
    return o
def box(name,loc,size,material,bevel=.04):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o=bpy.context.object; o.scale=size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    finish(o,name,material)
    if bevel:
        b=o.modifiers.new('Soft edges','BEVEL'); b.width=bevel; b.segments=3
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o
def sphere(name,loc,size,material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,location=loc);o=bpy.context.object;o.scale=size
    finish(o,name,material)
    for p in o.data.polygons:p.use_smooth=True
    return o
def rod(name,a,b,r,material):
    a,b=Vector(a),Vector(b); v=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=r,depth=v.length,location=(a+b)/2)
    o=bpy.context.object;o.rotation_euler=v.to_track_quat('Z','Y').to_euler();return finish(o,name,material)
def ring(name,loc,r,material,scale=(1,1,1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=.022,major_segments=32,minor_segments=8,location=loc,rotation=(math.pi/2,0,0))
    o=bpy.context.object;o.scale=scale;return finish(o,name,material)
# Open-front diorama; front is -Y.
box('Room foundation',(0,0,-.13),(5.4,4.3,.26),floor,.1)
box('Back wall',(0,2.04,1.65),(5.4,.15,3.3),cream)
box('Left wall',(-2.62,0,1.65),(.15,4.2,3.3),cream)
for x in range(12):box('Floor plank',(-2.43+x*.44,0,.012),(.012,4.12,.015),wood,0)
box('Rug',(.6,-.45,.035),(3.35,2.2,.04),green,.08)
# Window with a quiet blue sky.
box('Window frame',(-2.50,.60,2.0),(.10,1.72,1.8),wood)
box('Window sky',(-2.43,.60,2.0),(.035,1.54,1.61),mat('Sky',(.37,.66,.73),.3))
box('Window mullion',(-2.39,.60,2.0),(.06,.06,1.64),white)
box('Window crossbar',(-2.39,.60,2.0),(.06,1.58,.06),white)
# Desk, tower, monitor, and real keycaps.
box('Desktop',(0,.65,1.19),(2.9,1.2,.15),wood,.07)
for x in [-1.26,1.26]:
    for y in [.18,1.10]:box('Desk leg',(x,y,.58),(.09,.09,1.16),dark)
box('PC tower',(1.05,.65,1.63),(.37,.53,.72),dark)
for z in [1.44,1.76]:ring('PC illuminated fan',(1.05,.372,z),.115,mint)
box('Monitor foot',(-.28,.93,1.31),(.60,.34,.04),dark)
box('Monitor stem',(-.28,1.02,1.55),(.08,.08,.45),dark)
box('Monitor',(-.28,1.04,1.95),(1.44,.11,.87),dark,.055)
box('Screen',(-.28,.977,1.95),(1.30,.015,.73),screenmat,.015)
for i in range(10):
    z=2.24-i*.059
    box('Editor line number',(-.84,.962,z),(.025,.012,.014),purple,.003)
    for j in range(3):
        w=[.19,.28,.12,.32][(i+j)%4]
        box('Syntax code',(-.63+j*.29+(i%3)*.018,.962,z),(w,.012,.018),mint if j%2 else purple,.003)
box('Keyboard',(-.28,.32,1.293),(1.03,.34,.035),dark,.015)
for row in range(4):
    for col in range(13):box('Keycap',(-.75+col*.078,.205+row*.071,1.322),(.059,.051,.015),white,.004)
box('Mouse pad',(.53,.32,1.28),(.36,.41,.018),green)
sphere('Mouse',(.54,.30,1.32),(.085,.115,.035),dark)
rod('Mug',(-1.04,.72,1.27),(-1.04,.72,1.48),.095,white)
ring('Mug handle',(-1.155,.72,1.39),.063,white)
# Chair and seated character, gently oversized head.
rod('Chair pedestal',(0,-.66,.15),(0,-.66,.61),.07,dark)
for a in range(5):
    ang=a*2*math.pi/5;end=(.48*math.cos(ang),-.66+.48*math.sin(ang),.13)
    rod('Chair spoke',(0,-.66,.18),end,.03,dark);sphere('Caster',end,(.06,.06,.06),dark)
box('Chair seat',(0,-.65,.67),(.77,.67,.17),dark,.09)
box('Chair back',(0,-1.04,1.11),(.77,.14,.79),dark,.10)
sphere('Sweatshirt',(0,-.60,1.19),(.34,.26,.47),shirt)
rod('Neck',(0,-.56,1.49),(0,-.56,1.69),.12,skin)
sphere('Head',(0,-.53,1.96),(.32,.29,.36),skin)
sphere('Hair cap',(0,-.56,2.16),(.332,.294,.22),dark)
for x in [-.22,-.07,.09,.22]:sphere('Hair fringe',(x,-.75,2.15),(.105,.105,.13),dark)
for x in [-.335,.335]:sphere('Ear',(x,-.53,1.95),(.065,.06,.095),skin)
sphere('Nose',(0,-.855,1.94),(.055,.074,.065),skin)
# Facial features are grouped below, then turned toward the monitor.
for x in [-.145,.145]:
    ring('Round glasses',(x,-.825,2.01),.119,dark, (1,1,.89))
    sphere('Eye',(x,-.819,2.01),(.035,.025,.044),dark)
rod('Glasses bridge',(-.026,-.843,2.025),(.026,-.843,2.025),.014,dark)
for x in [-.28,.28]:rod('Glasses temple',(x,-.825,2.04),(x,-.56,2.04),.016,dark)
for x in [-.19,.19]:
    rod('Seated thigh',(x,-.61,.75),(x,-.12,.73),.14,blue)
    rod('Lower leg',(x,-.12,.73),(x,-.17,.23),.11,blue)
    sphere('Sneaker',(x,-.035,.16),(.14,.25,.10),white)
    rod('Upper sleeve',(x*1.6,-.52,1.45),(x*2,-.30,1.13),.11,shirt)
    rod('Forearm',(x*2,-.30,1.13),(x*1.65,.17,1.37),.085,shirt)
    hand=sphere('Typing hand L' if x<0 else 'Typing hand R',(x*1.65,.20,1.365),(.10,.115,.055),skin)
    base=hand.location.copy()
    for frame in range(1,98,4):
        hand.location=base+Vector((0,0,.025*math.sin((frame+(8 if x>0 else 0))*.65)))
        hand.keyframe_insert(data_path='location',frame=frame)
    hand.location=base
# Shelf, books, clock and plant.
box('Floating shelf',(.48,1.82,2.82),(2.55,.35,.10),wood)
for i in range(6):box('Book',( -.52+i*.12,1.81,3.02),(.09,.21,.31+(i%3)*.03),[green,purple,white][i%3])
box('Wall print',(1.63,1.94,2.03),(.67,.045,.76),wood)
box('Print paper',(1.63,1.906,2.03),(.57,.02,.66),white)
for x in [1.51,1.72]:rod('Print slash',(x,1.89,1.85),(x-.11,1.89,2.19),.018,green)
rod('Plant pot',(2.04,.98,.04),(2.04,.98,.47),.24,wood)
for i in range(8):
    a=i*2.4;top=(2.04+.28*math.cos(a),.98+.24*math.sin(a),.85+(i%3)*.24)
    rod('Plant stem',(2.04,.98,.42),top,.018,green)
    leaf=sphere('Plant leaf',top,(.13,.055,.26),green);leaf.rotation_euler=(.35,a,.4)
rod('Floor lamp stem',(-1.91,1.29,.04),(-1.91,1.29,2.19),.027,dark)
rod('Lamp base',(-1.91,1.29,.025),(-1.91,1.29,.09),.22,dark)
bpy.ops.mesh.primitive_cone_add(vertices=32,radius1=.32,radius2=.14,depth=.34,location=(-1.91,1.29,2.25));finish(bpy.context.object,'Lamp shade',gold)
# Keep hair, face and glasses together during the gentle head movement.
head=scene.objects.get('Head')
head_root=bpy.data.objects.new('Head motion',None);scene.collection.objects.link(head_root)
head_root.location=head.location.copy()
bpy.context.view_layer.update()
for o in list(scene.objects):
    if o.name.startswith(('Head','Hair','Ear','Nose','Round glasses','Eye','Glasses')) and o != head_root:
        o.parent=head_root;o.matrix_parent_inverse=head_root.matrix_world.inverted()
direction=scene.objects['Monitor'].location-head_root.location
head_root.rotation_euler.z=math.atan2(direction.x,-direction.y)
head=head_root;base=head.location.copy()
for f,z in [(1,0),(25,.025),(49,0),(73,-.015),(97,0)]:
    head.location=base+Vector((0,0,z));head.keyframe_insert(data_path='location',frame=f)
scene.frame_set(1)
world=bpy.data.worlds.new('Studio world');world.use_nodes=True;scene.world=world
next(n for n in world.node_tree.nodes if n.type=='BACKGROUND').inputs[0].default_value=(.18,.23,.26,1)
def light(name,loc,power,color,size):
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.color=color;d.shape='DISK';d.size=size
    o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
light('Softbox',(1,-3,6),650,(1,.85,.68),5)
light('Window fill',(-3,-1,4),450,(.65,.85,1),4)
light('Rim',(1,3,5),450,(.73,1,.88),3)
d=bpy.data.cameras.new('Studio camera');camera=bpy.data.objects.new('Studio camera',d);scene.collection.objects.link(camera)
camera.location=(7,-9,7);camera.rotation_euler=(Vector((0,0,1.2))-camera.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=8.0;scene.camera=camera
scene.render.resolution_x=1200;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True
scene.render.engine='CYCLES';scene.cycles.samples=32
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
    if o.type=='MESH' or o==head_root:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=ROOT+'/assets/studio.glb',export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='SCENE')
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/studio.blend',copy=True)
scene.render.filepath=ROOT+'/assets/studio-preview.png'
bpy.ops.render.render(write_still=True)
print({'scene':scene.name,'objects':len(scene.objects),'glb_bytes':os.path.getsize(ROOT+'/assets/studio.glb'),'blend':ROOT+'/assets/studio.blend'})
