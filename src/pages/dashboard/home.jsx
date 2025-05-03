import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export function Home() {
  // POS-relevant statistics cards data
  const statisticsCardsData = [
    {
      icon: CurrencyDollarIcon,
      title: "Today's Revenue",
      value: "$2,450",
      footer: {
        color: "text-green-500",
        value: "+12%",
        label: "than yesterday",
      },
    },
    {
      icon: ShoppingBagIcon,
      title: "Today's Orders",
      value: "143",
      footer: {
        color: "text-green-500",
        value: "+8%",
        label: "than yesterday",
      },
    },
    {
      icon: UsersIcon,
      title: "New Customers",
      value: "24",
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "than yesterday",
      },
    },
    {
      icon: ReceiptPercentIcon,
      title: "Discounts Applied",
      value: "$320",
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than yesterday",
      },
    },
  ];

  // POS-relevant charts data
  const statisticsChartsData = [
    {
      color: "blue",
      title: "Weekly Sales",
      description: "Last 7 days sales performance",
      chart: {
        type: "bar",
        height: 200,
        series: [
          {
            name: "Sales",
            data: [1200, 1800, 1500, 2200, 1900, 2500, 2100],
          },
        ],
        options: {
          xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        },
      },
      footer: "Updated 1 hour ago",
    },
    {
      color: "green",
      title: "Top Products",
      description: "Best selling items this week",
      chart: {
        type: "pie",
        height: 200,
        series: [35, 25, 20, 15, 5],
        options: {
          labels: ["Electronics", "Clothing", "Groceries", "Home Goods", "Other"],
        },
      },
      footer: "Updated 2 hours ago",
    },
    {
      color: "orange",
      title: "Customer Traffic",
      description: "Hourly customer visits today",
      chart: {
        type: "line",
        height: 200,
        series: [
          {
            name: "Visits",
            data: [30, 40, 25, 50, 49, 60, 70, 91, 125, 110, 95, 80],
          },
        ],
        options: {
          xaxis: {
            categories: ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"],
          },
        },
      },
      footer: "Updated just now",
    },
  ];

  // POS-relevant projects table data (could represent staff performance)
  const staffPerformanceData = [
    {
      img: "/img/team-1.jpg",
      name: "John Michael",
      sales: 45,
      transactions: 120,
      target: 100,
      completion: 120,
    },
    {
      img: "/img/team-2.jpg",
      name: "Alexa Liras",
      sales: 38,
      transactions: 95,
      target: 100,
      completion: 95,
    },
    {
      img: "/img/team-3.jpg",
      name: "Laurent Perrier",
      sales: 52,
      transactions: 140,
      target: 100,
      completion: 140,
    },
    {
      img: "/img/team-4.jpg",
      name: "Michael Levi",
      sales: 42,
      transactions: 110,
      target: 100,
      completion: 110,
    },
    {
      img: "/img/team-5.jpg",
      name: "Bruce Mars",
      sales: 48,
      transactions: 125,
      target: 100,
      completion: 125,
    },
  ];

  // POS-relevant orders overview (could represent recent transactions)
  const recentTransactionsData = [
    {
      icon: ShoppingCartIcon,
      color: "text-blue-500",
      title: "Order #12345 completed",
      description: "Payment received - $245.00",
    },
    {
      icon: ReceiptPercentIcon,
      color: "text-green-500",
      title: "Discount applied",
      description: "10% off for loyalty customer",
    },
    {
      icon: ChartBarIcon,
      color: "text-orange-500",
      title: "New inventory added",
      description: "15 new products in Electronics",
    },
    {
      icon: UsersIcon,
      color: "text-purple-500",
      title: "New customer registered",
      description: "Sarah Johnson joined loyalty program",
    },
  ];

  return (
    <div className="mt-2 flex-1 overflow-auto scrollbar-hide">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Staff Performance
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>3 staff members</strong> exceeded targets
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>View All</MenuItem>
                <MenuItem>Export Data</MenuItem>
                <MenuItem>Adjust Targets</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["employee", "sales", "transactions", "target", "performance"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {staffPerformanceData.map(
                  ({ img, name, sales, transactions, target, completion }, key) => {
                    const className = `py-3 px-5 ${key === staffPerformanceData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                      }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            ${sales * 100}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {transactions}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {target}%
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion >= 100 ? "green" : completion >= 80 ? "blue" : "red"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Recent Activity
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>15%</strong> more activity than yesterday
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {recentTransactionsData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === recentTransactionsData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                      }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;