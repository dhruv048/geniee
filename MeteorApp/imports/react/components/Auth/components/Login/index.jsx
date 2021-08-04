import React, { useState, useEffect, memo } from 'react';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {ROUTES} from '../../../../settings/routes';
import authHandlers from '../../../../store/effects/auth/handlers';
import { authActionsSelector } from '../../../../store/selectors';

 const Login =({ actions, history })=> {
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        email: cookie.load('email') || null,
        password: cookie.load('password') || null,
      });
    useEffect(() => {
        if (!actions.signedIn) return;
        // Redirect to dashboard
        history.push(ROUTES.ADMIN);
      }, [actions.signedIn, history]);
      useEffect(() => {
        if (!actions.loginError) return;
        setFormData((fd) => ({ ...fd, password: null }));
      }, [actions.loginError]);
      const handleChange = (event) => {
        event.persist();
        setFormData((fd) => ({
          ...fd,
          [event.target.name]: event.target.value,
        }));
      };
    
		return (
			 
               <div className="container">
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<div className="login-panel panel panel-default">
							<div className="panel-heading">
								<h3 className="panel-title">Please Sign In</h3>
							</div>
							<div className="panel-body">
								<form role="form">
									<fieldset>
										<div className="form-group">
											<input className="form-control" placeholder="E-mail" name="email" type="email" autoFocus  value={ formData.email }
            onChange={ handleChange }/>
										</div>
										<div className="form-group">
											<input className="form-control" placeholder="Password" name="password" type="password" value={ formData.password }
            onChange={ handleChange } />
										</div>
										<div className="checkbox">
											<label>
												<input id="rememberMe"
                name="rememberMe"
                checked={ rememberMe }
                onChange={ () => setRememberMe((r) => !r) } type="checkbox" value="Remember Me" />Remember Me
                      </label>
										</div>
										{/* <!-- Change this to a button or input when using this as a form --> */}
										<button className="btn btn-lg btn-success btn-block"
                                          onClick={ () => authHandlers.handleSignIn({
                                            email: formData.email,
                                            password: formData.password,
                                            rememberMe }) }
                                        >Login</button>
									</fieldset>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
			 
		);
}

export default withRouter(connect(authActionsSelector)(memo(Login)));