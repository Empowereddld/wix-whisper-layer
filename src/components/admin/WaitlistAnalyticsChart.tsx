import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface DayData {
  date: string;
  signups: number;
  day: string;
}

const WaitlistAnalyticsChart = () => {
  const [data, setData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);

        // Get the last 30 days of signups
        const { data: users, error } = await supabase
          .from("storybuilders_waitlist")
          .select("created_at");

        if (error) throw error;

        // Group signups by day
        const dayMap = new Map<string, number>();

        // Initialize last 30 days with 0 signups
        for (let i = 29; i >= 0; i--) {
          const date = startOfDay(subDays(new Date(), i));
          const dateStr = format(date, "yyyy-MM-dd");
          dayMap.set(dateStr, 0);
        }

        // Count signups per day
        if (users) {
          users.forEach((user: any) => {
            const date = startOfDay(new Date(user.created_at));
            const dateStr = format(date, "yyyy-MM-dd");
            if (dayMap.has(dateStr)) {
              dayMap.set(dateStr, (dayMap.get(dateStr) || 0) + 1);
            }
          });
        }

        // Convert to array and format
        const chartData: DayData[] = Array.from(dayMap.entries()).map(
          ([dateStr, count]) => ({
            date: dateStr,
            signups: count,
            day: format(new Date(dateStr), "MMM dd"),
          })
        );

        setData(chartData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="day"
          stroke="#9ca3af"
          style={{ fontSize: "12px" }}
        />
        <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#000" }}
          formatter={(value: number) => [`${value} signups`, "Signups"]}
          labelFormatter={(label: string) => label}
        />
        <Line
          type="monotone"
          dataKey="signups"
          stroke="#8861d4"
          strokeWidth={2}
          dot={{ fill: "#8861d4", r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WaitlistAnalyticsChart;
