import React from "react";

const DataTable = ({ data }) => {
  // Extract unique closed fiscal quarters and customer types
  const uniqueQuarters = [
    ...new Set(data.map((item) => item.closed_fiscal_quarter)),
  ];
  const uniqueCustomerTypes = [...new Set(data.map((item) => item.Cust_Type))];

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
    const totalQuarterACV = uniqueCustomerTypes.reduce(
      (total, type) => total + getTotalACV(quarter, type),
      0
    );
    const totalACV = getTotalACV(quarter, custType);
    return (totalACV / totalQuarterACV) * 100 || 0; // Return 0 if totalQuarterACV is 0 to prevent NaN
  };

  return (
    <div className="data-table">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-2 px-4" rowSpan="2">
              Closed Fiscal Quarter
            </th>
            {uniqueQuarters.map((quarter, index) => (
              <React.Fragment key={`header-${quarter}`}>
                <th
                  className={`border border-gray-300 ${
                    index % 2 == 0 ? "bg-[#4471c4]" : "bg-[#5b9bd5]"
                  }   py-2 px-4`}
                  colSpan={3}
                >
                  {quarter}
                </th>
              </React.Fragment>
            ))}
            <th
              className="border border-gray-300 bg-[#4471c4] py-2 px-4"
              rowSpan="2"
              colSpan={3}
            >
              Total
            </th>
          </tr>
          <tr className="bg-gray-100"></tr>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-2 px-4">Cust Type</th>
            {uniqueQuarters.flatMap((quarter) => [
              <th
                key={`subheader-${quarter}-ops`}
                className="border border-gray-300 py-2 px-4"
              >
                # of opps
              </th>,
              <th
                key={`subheader-${quarter}-acv`}
                className="border border-gray-300 py-2 px-4"
              >
                ACV
              </th>,
              <th
                key={`subheader-${quarter}-pct`}
                className="border border-gray-300 py-2 px-4"
              >
                % of total
              </th>,
            ])}
            <th className="border border-gray-300 py-2 px-4"># of opps</th>
            <th className="border border-gray-300 py-2 px-4">ACV</th>
            <th className="border border-gray-300 py-2 px-4">% of total</th>
          </tr>
        </thead>
        <tbody>
          {uniqueCustomerTypes.map((type, typeIndex) => (
            <tr key={`custType-${type}`} className="bg-white">
              <td className="border border-gray-300 py-2 px-4">{type}</td>
              {uniqueQuarters.map((quarter, quarterIndex) => (
                <React.Fragment key={`data-${quarter}-${type}`}>
                  <td
                    key={`data-${quarter}-${type}-ops`}
                    className="border border-gray-300 py-2 px-4 text-center"
                  >
                    {/* Number of opportunities */}
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
                    className="border border-gray-300 py-2 px-4 text-center"
                  >
                    {/* ACV */}
                    {getTotalACV(quarter, type).toFixed(2)}
                  </td>
                  <td
                    key={`data-${quarter}-${type}-pct`}
                    className="border border-gray-300 py-2 px-4 text-center"
                  >
                    {/* Percentage of total ACV */}
                    {getPercentageOfTotal(quarter, type).toFixed(2)}%
                  </td>
                </React.Fragment>
              ))}
              <td className=" border-gray-300 border py-2 px-4 text-center">
                {/* Total opportunities */}
                {data
                  .filter((item) => item.Cust_Type === type)
                  .reduce((total, item) => total + item.count, 0)}
              </td>
              <td className=" border-gray-300 border py-2 px-4 text-center">
                {/* Total ACV */}
                {data
                  .filter((item) => item.Cust_Type === type)
                  .reduce((total, item) => total + item.acv, 0)
                  .toFixed(2)}
              </td>
              <td className=" border-gray-300 border py-2 px-4 text-center">
                {/* Total percentage of total ACV */}
                {(
                  (data
                    .filter((item) => item.Cust_Type === type)
                    .reduce((total, item) => total + item.acv, 0) /
                    data.reduce((total, item) => total + item.acv, 0)) *
                  100
                ).toFixed(2)}
                %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
