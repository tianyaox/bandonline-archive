import os
fileList = os.listdir('./music/bass')
newFilenameList = []
for filename in fileList:
	if "." in filename:
		theIndex = filename.find(".")
		newFilename = filename[0:theIndex]
		newFilenameList.append(newFilename)

print newFilenameList
