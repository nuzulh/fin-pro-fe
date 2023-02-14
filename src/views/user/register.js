import React, { useState, useEffect } from 'react';
import { NotificationManager } from 'components/common/react-notifications';
import { Formik, Form, Field } from 'formik';
import { Row, Card, CardTitle, FormGroup, Label, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from 'redux/actions';

import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';
import { adminRoot } from 'constants/defaultValues';

const validatePassword = (value) => {
  let error;
  if (!value) {
    error = 'Mohon masukkan password';
  } else if (value.length < 7) {
    error = 'Password harus lebih dari 6 karakter';
  }
  return error;
};

const validateEmail = (value) => {
  let error;
  if (!value) {
    error = 'Mohon masukkan alamat email';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = 'Alamat email tidak valid';
  }
  return error;
};

const Register = ({ history, loading, error, registerUserAction }) => {
  const [email] = useState('');
  const [password] = useState('');
  const [username] = useState('');
  const [phoneNumber] = useState('');

  useEffect(() => {
    if (error) {
      NotificationManager.warning(error, 'Daftar Error', 3000, null, null, '');
    }
  }, [error]);

  const onUserRegister = (values) => {
    if (values.email !== '' && values.password !== '') {
      history.push(adminRoot);
      registerUserAction(values, history);
    }
  };

  const initialValues = { email, password, username, phoneNumber };

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2">DAFTAR</p>
            <p className="white mb-0">
              Silahkan isi isian berikut untuk melakukan registrasi akun. <br />
              Jika telah memiliki akun, silahkan{' '}
              <NavLink to="/user/login" style={{ color: 'orange' }}>
                <strong>masuk</strong>
              </NavLink>
              .
            </p>
          </div>
          <div className="form-side">
            <NavLink to="/" className="white">
              <span className="logo-single" />
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="user.register" />
            </CardTitle>

            <Formik initialValues={initialValues} onSubmit={onUserRegister}>
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.username" />
                    </Label>
                    <Field className="form-control" name="username" />
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.email" />
                    </Label>
                    <Field
                      className="form-control"
                      name="email"
                      validate={validateEmail}
                    />
                    {errors.email && touched.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.phone-number" />
                    </Label>
                    <Field className="form-control" name="phoneNumber" />
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.password" />
                    </Label>
                    <Field
                      className="form-control"
                      type="password"
                      name="password"
                      validate={validatePassword}
                    />
                    {errors.password && touched.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <NavLink to="/user/forgot-password">
                      <IntlMessages id="user.forgot-password-question" />
                    </NavLink>
                    <Button
                      color="primary"
                      className={`btn-shadow btn-multiple-state ${
                        loading ? 'show-spinner' : ''
                      }`}
                      size="lg"
                      type="submit"
                    >
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">
                        <IntlMessages id="user.register-button" />
                      </span>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
const mapStateToProps = () => {};

export default connect(mapStateToProps, {
  registerUserAction: registerUser,
})(Register);
