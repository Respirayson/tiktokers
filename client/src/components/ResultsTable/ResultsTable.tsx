import { ResultsTableProp } from "./ResultsTable.type";

const ResultsTable = (props: ResultsTableProp) => {
	const { headers, rowNames, rowData, modelType } = props;

	const tableHeaderInfo = headers.map((header, index) => (
		<th key={index} className="py-2">
			{header}
		</th>
	));

	const formatClusterCenter = (center: { [key: string]: number }) => {
		return Object.entries(center)
			.map(([key, value]) => `${key}: ${value}`)
			.join(", ");
	};

	const tableBodyInfo = rowData.map((row, rowIndex) => (
		<tr key={rowIndex}>
			<td className="border-t-2 text-end text-sm font-semibold">
				{rowNames[rowIndex]}
			</td>
			{headers.map((header, colIndex) => (
				<td className="border-t-2 text-center text-sm" key={colIndex}>
					{header.toLowerCase().replace(" ", "_") === "cluster_center" &&
					modelType === "kmeans"
						? formatClusterCenter(row.cluster_center)
						: row[header.toLowerCase().replace(" ", "_")]}
				</td>
			))}
		</tr>
	));

	return (
		<div className="h-[30vh] w-[60vw] flex flex-col items-center border-2 rounded-lg shadow-md overflow-auto no-vertical-scrollbar">
			<table className="h-full w-11/12 table-auto">
				<thead>
					<tr className="text-center text-sm text-stone-400">
						<th key="headers" className="w-1/6 py-2"></th>
						{tableHeaderInfo}
					</tr>
				</thead>
				<tbody>{tableBodyInfo}</tbody>
			</table>
		</div>
	);
};

export default ResultsTable;
