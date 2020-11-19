---
date: 2020-11-19 22:05:40
tags: ["Python","OpenCV"]
thumb: "./images/OpenCV-Optical-Flow로-객체-이동-거리-시각화.png"
title: OpenCV Optical Flow로 객체 이동 거리 시각화
---
# 소개

 [Optical Flow(광학 흐름)](https://en.wikipedia.org/wiki/Optical_flow)이란 연속되는 두개의 프레임에서 물체, 표면 및 가장자리의 명백한 움직임의 패턴입니다. 

 위 영상을 보면 사람이 움직이는 걸 계속 추적하여 라인을 그리는 것을 볼 수 있습니다.

이를 활용하여 공식 OpenCV Optical Flow 예제를 변형하여 정해진 객체의 움직임을 추정해보겠습니다.

 먼저 Optical Flow가 적용되기 위해서는 연속되는 프레임 두장에서 물체의 픽셀 강도가 변하지 않아야합니다. 이웃하는 픽셀들은 비슷한 움직임을 갖고 있어야합니다.

이를 만족하지 않고 프레임 두장이 차이가 많다면 당연히 Optical Flow를 구할 수 없습니다.

# 설치

```bash
> pip install numpy
> pip install opencv-python opencv-contrib-python
```

pip로 Python 전용 OpenCV 모듈을 설치합니다. Optical Flow 기능을 사용하기 위해서 opencv-contrib-python도 설치하였습니다.

# 기존 Optical Flow 예제 코드

```python
import numpy as np
import cv2 as cv
import argparse
parser = argparse.ArgumentParser(description='This sample demonstrates Lucas-Kanade Optical Flow calculation. \
                                              The example file can be downloaded from: \
                                              https://www.bogotobogo.com/python/OpenCV_Python/images/mean_shift_tracking/slow_traffic_small.mp4')
parser.add_argument('image', type=str, help='path to image file')
args = parser.parse_args()
cap = cv.VideoCapture(args.image)
# params for ShiTomasi corner detection
feature_params = dict( maxCorners = 100,
                       qualityLevel = 0.3,
                       minDistance = 7,
                       blockSize = 7 )
# Parameters for lucas kanade optical flow
lk_params = dict( winSize  = (15,15),
                  maxLevel = 2,
                  criteria = (cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03))
# Create some random colors
color = np.random.randint(0,255,(100,3))
# Take first frame and find corners in it
ret, old_frame = cap.read()
old_gray = cv.cvtColor(old_frame, cv.COLOR_BGR2GRAY)
p0 = cv.goodFeaturesToTrack(old_gray, mask = None, **feature_params)
# Create a mask image for drawing purposes
mask = np.zeros_like(old_frame)
while(1):
    ret,frame = cap.read()
    frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    # calculate optical flow
    p1, st, err = cv.calcOpticalFlowPyrLK(old_gray, frame_gray, p0, None, **lk_params)
    # Select good points
    good_new = p1[st==1]
    good_old = p0[st==1]
    # draw the tracks
    for i,(new,old) in enumerate(zip(good_new, good_old)):
        a,b = new.ravel()
        c,d = old.ravel()
        mask = cv.line(mask, (a,b),(c,d), color[i].tolist(), 2)
        frame = cv.circle(frame,(a,b),5,color[i].tolist(),-1)
    img = cv.add(frame,mask)
    cv.imshow('frame',img)
    k = cv.waitKey(30) & 0xff
    if k == 27:
        break
    # Now update the previous frame and previous points
    old_gray = frame_gray.copy()
    p0 = good_new.reshape(-1,1,2)
```

예제에서의 Optical Flow은 **goodFeaturesToTrack 함수**로 프레임 내에서의 코너를 찾아 포인트 벡터로 반환해줍니다. 

그 코너를 기준으로 Optical Flow를 실행하기 때문에 원하는 부분을 탐지할 수 없습니다. 

그러면 **goodFeaturesToTrack 함수**를 제거하고 원하는 부분을 포인트 벡터로 구해서 대입하면 원하는 영역 내에서 Optical Flow를 실행할 수 있지않을까요?

# 변형된 Optical Flow 예제 만들어보기

```python
...
p0 = cv.goodFeaturesToTrack(old_gray, mask = None, **feature_params)
print(p0.shape)
...
```

  먼저 위 예제 코드에서 goodFeaturesToTrack 반환값의 형태를 확인해보았습니다.

```python
(100, 1, 2)
```

저는 100 * 1 * 2 배열이 나왔습니다. 100은 사용자마다 다르겠죠? 그럼 대충 100개의 원소들과 1개의 껍데기, 2개의 값들로 이루어져있는 걸 알아낼 수 있습니다.

 이제부터 영역을 설정해봅시다 !

```python
(x,y,w,h) = cv.selectROI('Select Window', old_frame, fromCenter = False, showCrosshair = True)
```

selectROI 함수는 프레임 내에서 영역을 설정하면 좌표값으로 반환해줍니다.

먼저 selectROI 함수로 첫 프레임 내에서 원하는 구역을 설정하게 합시다 !

![OpenCV%20Optical%20Flow%E1%84%85%E1%85%A9%20%E1%84%80%E1%85%A2%E1%86%A8%E1%84%8E%E1%85%A6%20%E1%84%8B%E1%85%B5%E1%84%83%E1%85%A9%E1%86%BC%20%E1%84%80%E1%85%A5%E1%84%85%E1%85%B5%20%E1%84%89%E1%85%B5%E1%84%80%E1%85%A1%E1%86%A8%E1%84%92%E1%85%AA%2000f8ba52df784eeca0268b07f19acde8/Untitled.png](OpenCV%20Optical%20Flow%E1%84%85%E1%85%A9%20%E1%84%80%E1%85%A2%E1%86%A8%E1%84%8E%E1%85%A6%20%E1%84%8B%E1%85%B5%E1%84%83%E1%85%A9%E1%86%BC%20%E1%84%80%E1%85%A5%E1%84%85%E1%85%B5%20%E1%84%89%E1%85%B5%E1%84%80%E1%85%A1%E1%86%A8%E1%84%92%E1%85%AA%2000f8ba52df784eeca0268b07f19acde8/Untitled.png)

가운데 보이는 사람을 드래그하여 영역 설정을 하였습니다.

이제 설정한 영역을 포인트 벡터로 바꿔봅시다.

```python
point_list = []
for _y in range(y,y+h,10):
    for _x in range(x,x+w,10):
        point_list.append((_x,_y))
points = np.array(point_list)
print(points.shape)
```

 벡터를 대신할 수 있는 리스트를 먼저 선언한 뒤 y에서 y+h, x에서 x+h 10씩 띄어서 좌표를 다 때려박겠습니다. 

때려박은 좌표를 numpy로 변환시켜준 뒤 차원을 확인해보면

```python
(n, 2)
```

형태로 나올 것입니다 n개의 원소와 2개의 값입니다. 

하지만 아까 형태는 껍데기가 하나 존재했으니 **np.newaxis**로 차원을 늘려줍시다 !

```python
...
points = np.float32(points[:,np.newaxis,:])
print(points.shape)
```

```python
(n, 1, 2)
```

 성공적으로 goodFeaturesToTrack 반환값과 형태를 맞추었습니다. 그럼 이 값을 OpticalFlow에 전달하면 끝날 것 입니다.

```python
...
while(1):
    ret,frame = cap.read()
    frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    # calculate optical flow
    p1, st, err = cv.calcOpticalFlowPyrLK(old_gray, frame_gray, p0, None, **lk_params)
    # Select good points
    good_new = p1[st==1]
    good_old = p0[st==1]
    # draw the tracks
    for i,(new,old) in enumerate(zip(good_new, good_old)):
        a,b = new.ravel()
        c,d = old.ravel()
        mask = cv.line(mask, (a,b),(c,d), color[i].tolist(), 2)
        frame = cv.circle(frame,(a,b),5,color[i].tolist(),-1)
    img = cv.add(frame,mask)
    cv.imshow('frame',img)
    k = cv.waitKey(30) & 0xff
    if k == 27:
        break
    # Now update the previous frame and previous points
    old_gray = frame_gray.copy()
    p0 = good_new.reshape(-1,1,2)
```

원본 소스 중 goodFeaturesToTrack 으로 구한 p0을 방금 구한 points로 변환해줍시다.

```python
...
while(1):
    ret,frame = cap.read()
    frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    # calculate optical flow
    p1, st, err = cv.calcOpticalFlowPyrLK(old_gray, frame_gray, points, None, **lk_params)
    # Select good points
    good_new = p1[st==1]
    good_old = points[st==1]
    # draw the tracks
    for i,(new,old) in enumerate(zip(good_new, good_old)):
        a,b = new.ravel()
        c,d = old.ravel()
        mask = cv.line(mask, (a,b),(c,d), color[i].tolist(), 2)
        frame = cv.circle(frame,(a,b),5,color[i].tolist(),-1)
    img = cv.add(frame,mask)
    cv.imshow('frame',img)
    k = cv.waitKey(30) & 0xff
    if k == 27:
        break
    # Now update the previous frame and previous points
    old_gray = frame_gray.copy()
    points= good_new.reshape(-1,1,2)
```

**[전체 소스 (Github)](https://github.com/gron1gh1/opencv-motion-track-liner.git)**

# 결과
![OpenCV-Optical-Flow로-객체-이동-거리-시각화](https://user-images.githubusercontent.com/41789633/99670783-69a78c00-2ab4-11eb-9f0d-8c4253de5213.gif)

# 더 나아가

 지금은 임의로 박스를 만들어 영역을 설정했지만 혹시 Object Detection이 결합하여 탐지된 객체의 상자를 똑같이 적용한다면???

 자동으로 객체를 탐지하고 탐지한 객체를 시각적으로 추적해 나갈 것 입니다🤞

 해당 아이디어로로 **[GUARDIAN - CCTV감지체계](https://develment.blog/2020-%EA%B5%AD%EB%B0%A9%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8-%ED%95%B4%EC%BB%A4%ED%86%A4---guardian-%EA%B0%9C%EB%B0%9C-%ED%9B%84%EA%B8%B0-%E2%9C%94/)** 프로젝트가 구현됐었습니다 !