import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';


const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];


export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* Sidebar */}
      <div style={{ width: '250px',height:"980px", background: '#3a3a5e', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Task Manager</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px', cursor: 'pointer' }}>📊 Dashboard</li>
            <li style={{ marginBottom: '15px', cursor: 'pointer' }}>📁 Projects</li>
            <li style={{ marginBottom: '15px', cursor: 'pointer' }}>✅ Tasks</li>
            <li style={{ marginBottom: '15px', cursor: 'pointer' }}>📅 Calendar</li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontSize: '28px', color: '#3a3a5e' }}>Dashboard</h1>
        
        {/* Stats Section */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff',color:"#000", padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', flex: 1 }}>
            <h3>Total Tasks</h3>
            
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>1220</p>
          </div>
          <div style={{ background: '#ffffff',color:"#000", padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', flex: 1 }}>
            <h3>Completed</h3>
            
            <Stack spacing={2} direction="row">
              <CircularProgress variant="determinate" value={100} />
            </Stack>


            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>1550</p>
          </div>
          <div style={{ background: '#ffffff',color:"#000", padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', flex: 1 }}>
            <h3>Pending</h3>
            <Box sx={{ display: 'flex' }}>
             <CircularProgress />
              </Box>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>43</p>
          </div>
        </div>
        
        {/* Calendar and Upcoming Tasks */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, background: '#ffffff',color:"#000", padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Calendar</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          
          'StaticDateTimePicker',
        ]}
      >
        <DemoItem label="">
          <StaticDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        </DemoContainer>
       </LocalizationProvider>
          </div>



          <div style={{ flex: 1, background: '#ffffff',color:"#000", padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Upcoming Tasks</h3>

            <LineChart
                  width={500}
                  height={300}
                  series={[
                    { data: pData, label: 'pv' },
                    { data: uData, label: 'uv' },
                  ]}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
                />


    <BarChart
      xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
      series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
      width={500}
      height={300}
    />
           
          </div>
        </div>
      </div>
    </div>
  );
}
