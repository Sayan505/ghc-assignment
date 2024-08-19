import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`http://localhost:3000/api/orders?page=${currPage}`);
        if (!response.ok) {
          throw new Error('network error');
        }
        const data = await response.json();
        setOrders(data.data);
        setCurrPage(data.curr_page);
        setTotalPages(data.total_pages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currPage]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Orders Page</h1>
      <Link to="/">Go Home</Link>
      <div>
        <h2>Orders List:</h2>
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <p>Order ID: {order.order_id}</p>
              <p>Created At: {new Date(order.order_created_at).toLocaleString()}</p>
              <p>Customer ID: {order.customer_id}</p>
              <p>Customer Email: {order.customer_email}</p>
              <p>Through Notifications: {order.is_order_placed_after_notif.toLocaleString()}</p>
            </li>
          ))}
        </ul>
        <div>
          <button 
            disabled={currPage <= 1} 
            onClick={() => setCurrPage(currPage - 1)}
          >
            Previous
          </button>
          <span> Page {currPage} of {totalPages} </span>
          <button 
            disabled={currPage >= totalPages} 
            onClick={() => setCurrPage(currPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


export default OrdersPage;
