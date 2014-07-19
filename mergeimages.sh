
convert -coalesce ../afterimage.gif out%05d.png 

python <<EOF
import glob
import cv2

img = None
for filename in sorted(glob.glob('out*')):
    if img is None:
        img = cv2.imread(filename)
    else:
        img += cv2.imread(filename)
cv2.imshow('hoge',img)
cv2.waitKey(0)
EOF
