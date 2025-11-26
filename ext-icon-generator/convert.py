from PIL import Image
import sys
import os

fname=sys.argv[1]
filename, extension = os.path.splitext(fname)

print(sys.argv[1])
print(filename)
print( extension)
# input()

# Open the image file
image = Image.open(fname)
# image = Image.open('base.png')

# Set the desired width
#########################
project_path='../'
to_path=os.path.join(project_path,'extension/assets/icon')
#########################

def action(width):
	# Calculate the new height based on the aspect ratio
	height = int((float(image.size[1]) / float(image.size[0])) * float(width))

	# Resize the image
	resized_image = image.resize((width, height))

	# Create a new image with an alpha channel
	alpha = resized_image.convert('RGBA')

	# Save the resized image with transparency as PNG
	file_path=f'icon{width}.png'
	export_path=os.path.join(to_path,file_path)
	alpha.save(export_path)
	alpha.save(file_path)


action(128)
action(48)
action(16)

# input()