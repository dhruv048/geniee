import React, { Component } from 'react';
import Nav from '../components/Nav'
class Dashboard extends Component {

  render() {
    return (
      <div id="wrapper">
      <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{marginBottom: 0}}>
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">Geniee</a>
        </div>
        {/* <!-- /.navbar-header --> */}
  

        {/* <!-- /.navbar-top-links --> */}
  
         
        {/* <!-- /.navbar-static-side --> */}
      </nav>
      <main role="main">
      <div id="page-wrapper" style={{margin:'0px'}}>
        <div className="row">
          <div className="col-lg-12">
            <h1 className="page-header">Welcome to Geniee</h1>
          </div>
          {/*  /.col-lg-12  --> */}
        </div>
        {/*  /.row  --> */}
        
        {/*  /.row  --> */}
      </div>
      </main>
      </div>
    );
  }
}

export default Dashboard;
