function configRequest(instance: any, context: any) {
  instance.interceptors.request.use(
    function (config: any) {
      // const token = localStorage.getItem("Access-Token");
      // console.log(token)
      // const token = 'aacaf0d5-9e8a-4643-9142-77bcad5e1fd3';
      // if (token) {
      // config.headers.Authorization = "Bearer " + token;
      // }
      // else {
      //     router.push({ name: "Login" });
      // }
      return config;
    },
    function (err: any) {
      return Promise.reject(err);
    },
  );
}
function configResponse(instance: any, context: any) {
  instance.interceptors.response.use(
    (response: any) => {
      if (response.data.code === 'E503') {
        // localStorage.removeItem('Access-Token')
        // context.router.push({
        //       name: "Login",
        // });
        // router.go()
      }
      return response.data as any;
    },
    (error: any) => {
      if (error.response) {
        if (
          (error.response.status === 401 || error.response.status === 403) &&
          !window.location.pathname.includes('login')
        ) {
          // localStorage.removeItem('Access-Token')
          // localStorage.removeItem('Token-Expire')
          // router.push({ name: "Login" });
        }
        return Promise.reject(error.response.data);
      }
    },
  );
}
export default {
  configRequest,
  configResponse,
};
