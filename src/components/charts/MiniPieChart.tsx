import { PieChart, Pie, Cell } from "recharts";

function getStressColor(score: number) {
  if (score < 40) return "green.400";
  if (score < 70) return "orange.400";
  return "red.400";
}

export function MiniPieChart({
  spentPercentage,
  remainingPercentage,
}: {
  spentPercentage: number;
  remainingPercentage: number;
}) {
  const data = [
    { name: "Spent", value: spentPercentage },
    { name: "Remaining", value: remainingPercentage },
  ];

  const COLORS = [
    getStressColor(spentPercentage), // spent = stresskleur
    "#2D3748", // remaining = gray.700
  ];

  return (
    <PieChart width={80} height={80}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={22}
        outerRadius={35}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
    </PieChart>
  );
}
