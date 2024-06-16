import React from "react";

const DataTable = ({ data }) => {
  // Extract unique closed fiscal quarters from data
  const uniqueQuarters = [
    ...new Set(data && data.map((item) => item.closed_fiscal_quarter)),
  ];
  
  // Extract unique customer types from data
  const uniqueCustomerTypes = [...new Set(data && data.map((item) => item.Cust_Type))];

  // Function to calculate total ACV for a specific quarter and customer type
  const getTotalACV = (quarter, custType) => {
    return data
      .filter(
        (item) =>
          item.closed_fiscal_quarter === quarter && item.Cust_Type === custType
      )
      .reduce((total, item) => total + item.acv, 0);
  };

  // Function to calculate percentage of total ACV for a specific quarter and customer type
  const getPercentageOfTotal = (quarter, custType) => {
    const totalACVAllQuarters = data.reduce(
      (total, item) => total + item.acv,
      0
    );
    const totalACV = getTotalACV(quarter, custType);
    return (totalACV / totalACVAllQuarters) * 100 || 0; // Return 0 if totalACVAllQuarters is 0 to prevent NaN
  };

  // Function to format number as currency (e.g., $1,322,310)
  const formatCurrency = (number) => {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // Calculate total number of opportunities for the entire table
  const totalOpportunities =data &&  data.reduce(
    (total, item) => total + item.count,
    0
  );

  // Calculate total ACV for all quarters and customer types
  const totalACVAllQuarters = uniqueCustomerTypes.reduce(
    (total, type) =>
      total +
      uniqueQuarters.reduce(
        (quarterTotal, quarter) => quarterTotal + getTotalACV(quarter, type),
        0
      ),
    0
  );

  // Calculate total percentage of total ACV for Existing Customer and New Customer
  const totalPercentageExistingCustomer = (
    (data && data
      .filter((item) => item.Cust_Type === "Existing Customer")
      .reduce((total, item) => total + item.acv, 0) /
      totalACVAllQuarters) *
    100
  ).toFixed(2);

  const totalPercentageNewCustomer = (
    (data && data
      .filter((item) => item.Cust_Type === "New Customer")
      .reduce((total, item) => total + item.acv, 0) /
      totalACVAllQuarters) *
    100
  ).toFixed(2);

  return (
    <div className="data-table">
      <table className="min-w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            {/* Header for Closed Fiscal Quarter */}
            <th className="border border-gray-300 py-1 px-1 w-52" rowSpan="2">
              Closed Fiscal Quarter
            </th>
            {/* Headers for each unique quarter */}
            {uniqueQuarters.map((quarter, index) => (
              <React.Fragment key={`header-${quarter}`}>
                <th
                  className={`border border-gray-300 ${
                    index % 2 === 0 ? "bg-[#4471c4]" : "bg-[#5b9bd5]"
                  } py-1 px-1 text-center`}
                  colSpan={3}
                >
                  {quarter}
                </th>
              </React.Fragment>
            ))}
            {/* Header for Total */}
            <th
              className="border border-gray-300 bg-[#4471c4] py-1 px-1"
              rowSpan="2"
              colSpan={3}
            >
              Total
            </th>
          </tr>
          <tr className="bg-gray-100"></tr>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-1 px-1 ">Cust Type</th>
            {/* Subheaders for each quarter: # of opps, ACV, % of total */}
            {uniqueQuarters.flatMap((quarter) => [
              <th
                key={`subheader-${quarter}-ops`}
                className="border border-gray-300 py-1 px-1 w-72"
              >
                # of opps
              </th>,
              <th
                key={`subheader-${quarter}-acv`}
                className="border border-gray-300 py-1 px-1"
              >
                ACV
              </th>,
              <th
                key={`subheader-${quarter}-pct`}
                className="border border-gray-300 py-1 px-1  "
              >
                % of total
              </th>,
            ])}
            <th className="border border-gray-300 py-1 px-1"># of opps</th>
            <th className="border border-gray-300 py-1 px-1">ACV</th>
            <th className="border border-gray-300 py-1 px-1">% of total</th>
          </tr>
        </thead>
        <tbody>
          {/* Rows for each unique customer type */}
          {uniqueCustomerTypes.map((type, typeIndex) => (
            <tr key={`custType-${type}`} className="bg-white">
              <td className="border border-gray-300 py-2 px-2">{type}</td>
              {uniqueQuarters.map((quarter, quarterIndex) => (
                <React.Fragment key={`data-${quarter}-${type}`}>
                  <td
                    key={`data-${quarter}-${type}-ops`}
                    className="border border-gray-300 py-2 px-2 text-center"
                  >
                    {/* Number of opportunities for each quarter and customer type */}
                    {data
                      .filter(
                        (item) =>
                          item.closed_fiscal_quarter === quarter &&
                          item.Cust_Type === type
                      )
                      .reduce((total, item) => total + item.count, 0)}
                  </td>
                  <td
                    key={`data-${quarter}-${type}-acv`}
                    className="border border-gray-300 py-1 px-1 text-center"
                  >
                    {/* ACV for each quarter and customer type */}
                    {formatCurrency(getTotalACV(quarter, type))}
                  </td>
                  <td
                    key={`data-${quarter}-${type}-pct`}
                    className="border border-gray-300 py-1 px-1 text-center"
                  >
                    {/* Percentage of total ACV for each quarter and customer type */}
                    {getPercentageOfTotal(quarter, type).toFixed(2)}%
                  </td>
                </React.Fragment>
              ))}
              <td className="border border-gray-300 py-1 px-1 text-center">
                {/* Total number of opportunities for each customer type */}
                {data
                  .filter((item) => item.Cust_Type === type)
                  .reduce((total, item) => total + item.count, 0)}
              </td>
              <td className="border border-gray-300 py-1 px-1 text-center">
                {/* Total ACV for each customer type */}
                {formatCurrency(
                  data
                    .filter((item) => item.Cust_Type === type)
                    .reduce((total, item) => total + item.acv, 0)
                )}
              </td>
              <td className="border border-gray-300 py-2 px-2 text-center">
                {/* Total percentage of total ACV for each customer type */}
                {type === "Existing Customer"
                  ? totalPercentageExistingCustomer
                  : totalPercentageNewCustomer}
                %
              </td>
            </tr>
          ))}
          {/* Total row for all data */}
          <tr className="bg-gray-100 ">
            <td className="border  border-gray-300 py-2 px-2 font-semibold">
              Total
            </td>
            {uniqueQuarters.map((quarter) => (
              <React.Fragment key={`total-${quarter}`}>
                <td className="border border-gray-300 py-1 px-1 text-center font-semibold">
                  {/* Total number of opportunities for each quarter */}
                  {data
                    .filter((item) => item.closed_fiscal_quarter === quarter)
                    .reduce((total, item) => total + item.count, 0)}
                </td>
                <td className="border border-gray-300 py-1 px-1 text-center font-semibold">
                  {/* Total ACV for each quarter */}
                  {formatCurrency(
                    data
                      .filter((item) => item.closed_fiscal_quarter === quarter)
                      .reduce((total, item) => total + item.acv, 0)
                  )}
                </td>
                <td className="border border-gray-300 py-1 px-1 text-center font-semibold">
                  100% {/* Hardcoded since it should sum up to 100% */}
                </td>
              </React.Fragment>
            ))}
            <td className="border border-gray-300 py-1 px-1 text-center font-semibold">
              {totalOpportunities}
            </td>
            <td className="border border-gray-300 py-1 px-1 text-center font-semibold">
              {formatCurrency(totalACVAllQuarters)}
            </td>
            <td className="border border-gray-300 py-1 px-1 text-center font-semibold">
              100% {/* Hardcoded since it should sum up to 100% */}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
