---
date: 2021-06-20 15:19:00
tags: ["React"]
thumb: "./images/React-Suspense로-비동기-Fetch-관리-thumb.png"
title: React Suspense로 비동기 Fetch 관리
---
## React Suspense 란?

React 16.6 버전에서는 코드를 불러오는 동안 “기다릴 수 있고”, 기다리는 동안 로딩 상태(스피너와 같은 것)를 선언적으로 지정할 수 있도록 `<Suspense>` 컴포넌트가 추가되었습니다.

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 지연 로딩

// 프로필을 불러오는 동안 스피너를 표시합니다
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

데이터를 가져오기 위한 Suspense는 `<Suspense>`를 사용하여 선언적으로 데이터를 비롯한 무엇이든 “기다릴” 수 있도록 해주는 새로운 기능입니다. 이 페이지에서는 사용 사례 가운데 데이터 로딩에 초점을 두지만, 이 기능은 이미지, 스크립트, 그 밖의 비동기 작업을 기다리는 데에도 사용될 수 있습니다.

[데이터를 가져오기 위한 Suspense (실험 단계) - React](https://ko.reactjs.org/docs/concurrent-mode-suspense.html#what-is-suspense-exactly)

 React  공식 홈페이지에서 일부 가져온 정보입니다.  필자는 Toss 개발자 컨퍼런스 중 '프론트엔드 웹 서비스에서 우아하게 비동기 처리하기'편을 보고 감명받아 직접 사용해보기로 했습니다.

**React Suspense를 사용해서  Fetch나 번들 로딩 등 여러가지 기다림이 필요한 문제를 우아하게 해결 할 수 있습니다.**

## 어떤 문제를 해결?

### 기존 문제

 일반적으로 axios 같은 라이브러리를 활용하여 비동기로 데이터를 가져옵니다. 여기서 **문제점은 보통 useEffect와 useState를 사용해 명령형 프로그래밍 방식**으로 가져오게 됩니다.

 예시를 들겠습니다.

```jsx
import React, {useEffect, useState} from "react";
import axios from "axios";

function TestComp() {
	const [data,SetData] = useState(null);
	const [error,SetError] = useState(null);
	const [isLoading,SetLoading] = useState(false);
	useEffect(() => {
			const fetchData = async () => {
				try{
					SetLoading(true);
					const _data = await axios.get("http://localhost:3000/data");
					SetData(_data);
				}
				catch(err) {
					SetError(err.response);
				}
				finally{
					SetLoading(false);
				}
			};
	}, []);
	
	return (
			<div>
				{isLoading && <p>Loading...</p>}
				{error !== null && <p>Error Fetch</p>}
				{data !== null && <p>Fetch Data : {data}</p>} 
			</div>
	)
}
```

 간단하게 짜본 코드입니다.

 먼저 useEffect에 의해 렌더링 시 fetch를 진행하고 로딩 엘리먼트를 출력합니다.

해당 fetch가 오류가 나면 엘리먼트에서 **"Error Fetch"**를 출력하고 정상 출력이면 **"Fetch Data"**를 출력합니다.

그냥 눈으로 봤을 때 try catch 구간은 useEffect 안에서만 사용되고 출력되는 엘리먼트에서 따로 처리해줍니다.

결국 예외처리를 useEffect에서 한번, 출력 엘리먼트에서 한번으로 2번 이뤄질 것 입니다.

### React Suspense로 해결

 이번에는 React Suspense를 도입해보겠습니다.

```jsx
// suspense.js
import React from "react";

// Suspense 사용을 위한 promise 통합 객체 만드는 함수.
export const createResource = (promise) => {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (data) => {
      status = "success";
      result = data;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      }
			// status === "success"
      return result;
    },
  };
};

// React 공식 문서의 선언적 Error 처리 컴포넌트
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

```jsx
// App.js
import React, {useEffect, useState} from "react";
import axios from "axios";
import {ErrorBoundary} from "./suspense";

function TestComp(props) {
	return (
			<div>
				Fetch Data: {props.data}
			</div>
	)
}

// Suspense 사용을 위한 객체 만들기.
const resource = createResource(axios.get("http://localhost:3001/data"));

function SuspenseComp() {
	const data = resource.read();

  return (
		<ErrorBoundary fallback={<p>Error Fetch</p>}>
	    <Suspense fallback={<p>Loading profile...</p>}>
	      <TestComp data={data} />
	    </Suspense>
		</ErrorBoundary>
  );
}
```

 어떤가요? SuspenseComp를 보면 선언적으로 엘리먼트에서 **에러 처리**와 **로딩 처리**를 한번에 하고 있습니다.

기존에 렌더링 후 불러오기 후 에러처리 등 번거로운 방식이 아니라 **불러오기 후 에러 처리, 로딩 처리 방식**이 됐습니다.

React Suspense를 사용하기 위해서는 특별한 객체를 만들어야합니다.

그러기 위해  만들어진 함수가 **suspense.js/createResource** 입니다.

**해당 함수는 프로미스를 인자로 받아 프로미스의 상태를 구분해 Suspense가 해당 Fetch를 해결해줍니다.** 

read() 메소드에 fetch의 결과값이 반환되기 때문에 꼭 Suspense가 사용된 컴포넌트 내에서 read()를 불러와  해당 데이터를 필요한 컴포넌트에 props로 넘겨줘야합니다.

### 여러개의 Fetch 활용

```jsx
const promises = Promise.all([
  axios.get("http://localhost:3001/data"),
  axios.get("http://localhost:3001/data2"),
]);
const resource = createResource(promises);
```

이런식으로 사용하게 되면 한번에 여러가지 fetch를 받고 모든 Fetch가 끝날때까지 로딩 처리와 에러 처리 역시 같이 할 수 있습니다.

![skeleton](https://user-images.githubusercontent.com/41789633/122724097-93c16680-d2ae-11eb-9b52-b97764e9e3b4.gif)

웹 어플리케이션을 접하다보면 이런 Skeleton를 볼 수 있을 것입니다.

위 기능들을 잘 활용한다면 선언적으로 비동기를 관리하면서 Skeleton을 만들어 예쁜 웹 어플리케이션을 개발 할 수 있을 겁니다 !