import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Modal,
  message,
  Select,
  Table,
  DatePicker,
} from 'antd';
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  const baseURL = 'https://expense-tracker-1i4h.onrender.com/api/v1';

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => {
            setEditable(record);
            setShowModal(true);
          }} />
          <DeleteOutlined className="mx-2" onClick={() => handleDelete(record)} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return message.error('User not found');

        setLoading(true);
        const res = await axios.post(`${baseURL}/transactions/get-transactions`, {
          userid: user._id,
          frequency,
          selectedDate:
            selectedDate.length === 2
              ? [selectedDate[0].toISOString(), selectedDate[1].toISOString()]
              : [],
          type,
        });

        setAllTransaction(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        message.error('Fetch issue with transaction');
      }
    };

    getAllTransactions();
  }, [frequency, selectedDate, type]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(`${baseURL}/transactions/delete-transaction`, {
        transactionId: record._id,
      });
      setLoading(false);
      message.success('Transaction deleted');
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('Unable to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return message.error('User not found');

      setLoading(true);
      if (editable) {
        await axios.post(`${baseURL}/transactions/edit-transaction`, {
          payload: { ...values, userId: user._id },
          transactionId: editable._id,
        });
        message.success('Transaction updated successfully');
      } else {
        await axios.post(`${baseURL}/transactions/add-transaction`, {
          ...values,
          userid: user._id,
        });
        message.success('Transaction was successful');
      }
      setLoading(false);
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error('Failed to add transaction');
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}

      {/* Filters */}
      <div className="filters d-flex align-items-end flex-wrap gap-3 my-3">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(val) => setFrequency(val)} style={{ minWidth: 150 }}>
            <Select.Option value="7">Last one week</Select.Option>
            <Select.Option value="30">Last one month</Select.Option>
            <Select.Option value="365">Last one year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(val) => setType(val)} style={{ minWidth: 150 }}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>

        <div>
          <h6>View Mode</h6>
          <div className="d-flex align-items-center border rounded p-1">
            <UnorderedListOutlined
              className={`mx-2 fs-5 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
              onClick={() => setViewData('table')}
            />
            <AreaChartOutlined
              className={`mx-2 fs-5 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
              onClick={() => setViewData('analytics')}
            />
          </div>
        </div>

        <div className="ms-auto">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add new</button>
        </div>
      </div>

      {/* Table or Analytics */}
      <div className="content">
        {viewData === 'table' ? (
          <Table columns={columns} dataSource={allTransaction} rowKey="_id" />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      {/* Modal */}
      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount"><Input type="text" /></Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fees</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date"><Input type="date" /></Form.Item>
          <Form.Item label="Reference" name="reference"><Input type="text" /></Form.Item>
          <Form.Item label="Description" name="description"><Input type="text" /></Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
