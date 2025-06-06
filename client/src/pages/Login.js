import React, { useState, useEffect } from 'react';
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from '../components/Spinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = 'https://expense-tracker-1i4h.onrender.com/api/v1';


  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${baseURL}/users/login`, values);
      setLoading(false);
      message.success('login success');
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
      navigate('/');
    } catch (error) {
      setLoading(false);
      message.error('something went wrong');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="register-page">
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Login Form</h1>
        <Form.Item label="Email" name="email"><Input type="email" /></Form.Item>
        <Form.Item label="Password" name="password"><Input type="password" /></Form.Item>
        <div className="d-flex justify-content-between">
          <Link to="/register">Not a user? Click here to register</Link>
          <button className="btn btn-primary">Sign in</button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
