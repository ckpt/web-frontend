// This file bootstraps the entire application.

"use strict";

var CKPTApp = require("./components/CKPTApp.react").default;

var React = require("react");
var ReactDOM = require("react-dom");
window.React = React; // export for http://fb.me/react-devtools

import { withRouter, HashRouter as Router } from 'react-router-dom'

const CKPTAppWithRouter = withRouter(CKPTApp);

ReactDOM.render(<Router><CKPTAppWithRouter/></Router>, document.getElementById("app"));
