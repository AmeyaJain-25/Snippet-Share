import React from "react";
//Packages-----------------
import { BrowserRouter, Switch, Route } from "react-router-dom";
//Components-----------------
import Signin from "./user/Signin/Signin";
import Signup from "./user/Signup/Signup";
import PrivateRoutes from "./auth/helper/PrivateRoutes";
import Home from "./core/Home";
import CreatePost from "./core/CreatePost";
import UpdatePost from "./core/UpdatePost";
import Profile from "./core/Profile";
import OtherProfile from "./core/OtherProfile";
import ViewPost from "./core/ViewPost";
import Page404 from "./Page404";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoutes path="/home" exact component={Home} />
        <PrivateRoutes path="/post/create" exact component={CreatePost} />
        <PrivateRoutes path="/post/view/:postId" exact component={ViewPost} />
        <PrivateRoutes path="/profile" exact component={Profile} />
        <PrivateRoutes
          path="/otherProfile/:userid"
          exact
          component={OtherProfile}
        />
        <PrivateRoutes
          path="/post/update/:postId"
          exact
          component={UpdatePost}
        />
        <Route path="*" exact component={Page404} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
