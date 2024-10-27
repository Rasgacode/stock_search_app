import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState } from "react";

export interface PriceHistory {
  date: string;
  close: number;
}

interface StockChartProps {
  priceHistory: PriceHistory[];
}

const StockChart = ({ priceHistory }: StockChartProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const minClose = Math.min(...priceHistory.map(data => data.close));
  const maxClose = Math.max(...priceHistory.map(data => data.close));
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mt-8">
      <h2 className="text-2xl font-bold mb-4">Price History</h2>
        <LineChart width={isMobile ? 250 : 750} height={isMobile ? 150 : 450} data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date"/>
          <YAxis domain={[minClose - 10, maxClose + 10]} />
          <Tooltip/>
          <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{r: 8}}/>
        </LineChart>
    </div>
  )
};

export default StockChart;
