import React, {useState} from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { BsArrowUpRight } from "react-icons/bs";
import MetricCard from '../components/MetricCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import OrdersAnalysis from '../components/OrdersAnalysis';

// Sample data for the year
const analysisData = [
  { month: 'Jan', revenue: 45000, orders: 220 },
  { month: 'Feb', revenue: 52000, orders: 280 },
  { month: 'Mar', revenue: 48000, orders: 250 },
  { month: 'Apr', revenue: 61000, orders: 320 },
  { month: 'May', revenue: 55000, orders: 290 },
  { month: 'Jun', revenue: 67000, orders: 350 },
  { month: 'Jul', revenue: 72000, orders: 380 },
  { month: 'Aug', revenue: 69000, orders: 360 },
  { month: 'Sep', revenue: 75000, orders: 400 },
  { month: 'Oct', revenue: 82000, orders: 420 },
  { month: 'Nov', revenue: 87000, orders: 450 },
  { month: 'Dec', revenue: 92000, orders: 480 },
];

const Dashboard = () => {

  const [timeframe, setTimeframe] = useState('year');

  // Calculate total revenue and orders
  const totalRevenue = analysisData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = analysisData.reduce((sum, item) => sum + item.orders, 0);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">
            Revenue: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-green-600">
            Orders: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-violet-50 min-h-[100vh] py-9 px-12'>
    <AdminNavbar/>
    
    <div className='flex justify-center gap-x-12'>
    <MetricCard bgColor={'#C9CC3F'} name={'Total Sales'}/>
    <MetricCard bgColor={'#B6D0E2'} name={'Revenue'}/>
    <MetricCard bgColor={'#C1E1C1'} name={'Orders'} />
    <MetricCard bgColor={'#FFFFFF'} name={'Sent Bills'}/>
    </div>


  <div className="bg-[#B6D0E2] rounded-xl mt-12 max-w-[1100px] mx-auto p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Revenue vs Orders Analysis</h2>
          <div className="flex gap-2">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="year">Yearly</option>
              <option value="quarter">Quarterly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex flex-col">
            <p className="text-sm text-blue-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-800">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex flex-col">
            <p className="text-sm text-green-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-green-800">
              {totalOrders.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analysisData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#666' }}
                tickLine={{ stroke: '#666' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#666' }}
                tickLine={{ stroke: '#666' }}
                axisLine={{ stroke: '#666' }}
                label={{ 
                  value: 'Revenue ($)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#666' }
                }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fill: '#666' }}
                tickLine={{ stroke: '#666' }}
                axisLine={{ stroke: '#666' }}
                label={{ 
                  value: 'Orders', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fill: '#666' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px'
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6, stroke: '#2563EB' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6, stroke: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>


        </div>
  )
}

export default Dashboard