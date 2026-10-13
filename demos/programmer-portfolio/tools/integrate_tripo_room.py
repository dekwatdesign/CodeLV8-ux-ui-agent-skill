"""Local room integration and actual hand/head morph animation. No Tripo API calls."""
import bpy,math,os,json,shutil,contextlib,io
from mathutils import Vector
from array import array
ROOT='D:/Projects/CodeLV8-ux-ui-agent-skill/demos/programmer-portfolio'
assert 'Portfolio Tripo Studio' not in bpy.data.scenes,'Integrated scene already exists'
source=bpy.data.scenes['Portfolio Studio']
review=bpy.data.scenes['Tripo Character Review']
character=review.objects['tripo_node_2899f885']
backup='D:/Projects/CodeLV8-ux-ui-agent-skill/output/blender-backups/tripo-room-integration-before'
os.makedirs(backup,exist_ok=True)
for filename in ['studio.blend','studio.glb','studio-mobile.glb','studio-preview.png']:
    if not os.path.exists(backup+'/'+filename):shutil.copy2(ROOT+'/assets/'+filename,backup+'/'+filename)
bpy.ops.wm.save_as_mainfile(filepath=backup+'/live-session.blend',copy=True)
bpy.context.window.scene=source;bpy.context.view_layer.update()
source_depsgraph=bpy.context.evaluated_depsgraph_get()
baked_furniture={}
for original_obj in source.objects:
    if original_obj.type=='MESH' and original_obj.modifiers and not original_obj.name.startswith(('Head','Hair','Sweatshirt','Typing','Retopo','High')):
        evaluated=original_obj.evaluated_get(source_depsgraph)
        baked_furniture[original_obj.name]=bpy.data.meshes.new_from_object(evaluated,preserve_all_data_layers=True,depsgraph=source_depsgraph)
scene=bpy.data.scenes.new('Portfolio Tripo Studio');bpy.context.window.scene=scene
scene.world=source.world;scene.frame_start=1;scene.frame_end=97;scene.render.fps=24
excluded=('Head motion','Head','Hair','Ear','Nose','Round glasses','Eye','Glasses','Sweatshirt','Neck',
          'Seated thigh','Lower leg','Sneaker','Typing hand','Upper sleeve','Forearm','Retopo source','High source',
          'Chair seat','Chair back','Keyboard','Keycap')
depsgraph=bpy.context.evaluated_depsgraph_get()
for obj in source.objects:
    if obj.name.startswith(excluded) or any('Retopology Sources' in c.name for c in obj.users_collection):continue
    copy=obj.copy();copy.name='Room '+obj.name;scene.collection.objects.link(copy)
    if obj.type=='MESH' and obj.modifiers:
        # Bake only copied furniture, preserving the original scene and supporting morph export.
        copy.data=baked_furniture[obj.name]
        copy.modifiers.clear()
    if obj.name.startswith(('Chair pedestal','Chair spoke','Caster')):copy.location.y+=.30
    if obj.name=='Chair pedestal':copy.scale.z*=1.3;copy.location.z+=.07
    if obj==source.camera:scene.camera=copy
assert scene.camera is not None
mesh=character.data.copy()
obj=bpy.data.objects.new('Tripo seated programmer',mesh);scene.collection.objects.link(obj)
# Texture labels separate exposed fingers from cloth/pants for the local animation masks.
image=bpy.data.images['tripo_image_2899f885_0'];width,height=image.size
pixels=array('f',[0.0])*len(image.pixels);image.pixels.foreach_get(pixels)
uv=mesh.uv_layers.active.data
skin=[0.0]*len(mesh.vertices);blue=[0.0]*len(mesh.vertices);grey=[0.0]*len(mesh.vertices);counts=[0]*len(mesh.vertices)
for face in mesh.polygons:
    coord=sum((uv[i].uv for i in face.loop_indices),Vector((0,0)))/len(face.loop_indices)
    pixel=(min(height-1,max(0,int(coord.y*height)))*width+min(width-1,max(0,int(coord.x*width))))*4
    r,g,b=pixels[pixel:pixel+3]
    is_skin=float(r>g*1.1 and g>b*1.05)
    is_blue=float(b>r*1.15 and b>g*1.02)
    is_grey=float(abs(r-g)<.04 and abs(g-b)<.04 and .2<r<.85)
    for index in face.vertices:
        skin[index]+=is_skin;blue[index]+=is_blue;grey[index]+=is_grey;counts[index]+=1
for i,count in enumerate(counts):
    if count:skin[i]/=count;blue[i]/=count;grey[i]/=count
def smooth(x):
    x=max(0,min(1,x));return x*x*(3-2*x)
original=[character.matrix_world@v.co for v in mesh.vertices]
factor=1.35;offset=Vector((-.28,-.35,.04))
keyboard_samples=[p.z for i,p in enumerate(original) if grey[i]>.6 and p.y<-.11 and .56<p.z<.69]
assert keyboard_samples,'Keyboard plane could not be identified'
keyboard_samples.sort();keyboard_height=keyboard_samples[len(keyboard_samples)//2]
raise_amount=1.315-(keyboard_height*factor+offset.z)
assert .15<raise_amount<.65,raise_amount
posed=[]
for i,p in enumerate(original):
    point=Vector((-p.x*factor,-p.y*factor,p.z*factor))+offset
    # Raise keyboard, fingers and lower sleeves as one pose adjustment. Jeans/seat stay put.
    front=smooth((-p.y-.02)/.12)
    height_mask=smooth((p.z-.48)/.10)*smooth((1.10-p.z)/.18)
    weight=front*height_mask*(1-blue[i])
    if grey[i]>.6 and p.y<-.11 and .56<p.z<.69:weight=1
    point.z+=raise_amount*weight
    posed.append(point);mesh.vertices[i].co=point
mesh.update()
obj.shape_key_add(name='Basis')
left=obj.shape_key_add(name='Type left');right=obj.shape_key_add(name='Type right');breath=obj.shape_key_add(name='Breathe')
affected={'left':0,'right':0,'head':0}
for i,(p,point) in enumerate(zip(original,posed)):
    fingers=skin[i]*smooth((-p.y-.08)/.10)*smooth((p.z-.56)/.06)*smooth((.98-p.z)/.10)
    if p.x<0:
        left.data[i].co.z-=.016*fingers
        if fingers>.1:affected['left']+=1
    else:
        right.data[i].co.z-=.016*fingers
        if fingers>.1:affected['right']+=1
    head=smooth((p.z-1.02)/.16)
    breath.data[i].co.z+=.008*head;breath.data[i].co.y+=.003*head
    if head>.1:affected['head']+=1
assert min(affected.values())>100,affected
for frame in range(1,98,4):
    phase=(frame-1)/96*2*math.pi
    left.value=(1-math.cos(phase*8))/2;left.keyframe_insert(data_path='value',frame=frame)
    right.value=(1-math.cos(phase*8+math.pi))/2;right.keyframe_insert(data_path='value',frame=frame)
    breath.value=(1-math.cos(phase))/2;breath.keyframe_insert(data_path='value',frame=frame)
scene.frame_set(1)
# Copy generated materials so the mobile texture scaling cannot affect the candidate/source.
for index,mat in enumerate(mesh.materials):mesh.materials[index]=mat.copy()
original_images=[]
for mat in mesh.materials:
    for node in mat.node_tree.nodes:
        if node.type=='TEX_IMAGE' and node.image:original_images.append((node,node.image))
report={'scene':scene.name,'character':'Tripo seated programmer','animation':'local morph targets: left fingers, right fingers, breathing',
        'affected_vertices':affected,'keyboard_source_height':keyboard_height,'pose_raise_m':raise_amount,
        'character_height_m':1.6*factor,'uses_generated_keyboard_and_seat_shell':True,'rig_type':'morph animation, no skeleton',
        'additional_tripo_credits':0,'backup':backup}
def select_room():
    bpy.ops.object.select_all(action='DESELECT')
    for object in scene.objects:
        if object.type=='MESH':object.select_set(True)
def export(filename):
    select_room()
    with contextlib.redirect_stdout(io.StringIO()):
        bpy.ops.export_scene.gltf(filepath=ROOT+'/assets/'+filename,export_format='GLB',use_selection=True,use_active_scene=True,
                                  export_apply=False,export_animations=True,export_animation_mode='SCENE',export_morph=True)
export('studio.glb')
report['high_glb_bytes']=os.path.getsize(ROOT+'/assets/studio.glb')
mobile_images={}
for node,image in original_images:
    if image.name not in mobile_images:
        copy=image.copy();copy.name='Mobile '+image.name;copy.scale(1024,1024);copy.pack();mobile_images[image.name]=copy
    node.image=mobile_images[image.name]
export('studio-mobile.glb')
report['mobile_glb_bytes']=os.path.getsize(ROOT+'/assets/studio-mobile.glb')
for node,image in original_images:node.image=image
scene.render.engine='CYCLES';scene.cycles.samples=48
scene.render.resolution_x=1200;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True
with contextlib.redirect_stdout(io.StringIO()):
    bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/assets/studio.blend',copy=True)
    scene.render.filepath=ROOT+'/assets/studio-preview.png';bpy.ops.render.render(write_still=True)
with open(ROOT+'/evidence/tripo-room.json','w',encoding='utf-8') as file:json.dump(report,file,indent=2)
print(json.dumps(report))
