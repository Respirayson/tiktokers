import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import DataTable from "./components/DataTable/DataTable";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import { InputFile } from "./components/input-file";
import AnalyticsTable from "./components/AnalyticsTable/AnalyticsTable";
import ResultsTable from "./components/ResultsTable/ResultsTable";
import {
	mockHeaders,
	mockRowData,
	mockRowNames,
} from "./components/AnalyticsTable/AnalyticsMockData";
import axios from "axios";

function App() {
	const [headers, setHeaders] = useState<Array<string>>([]);
	const [body, setBody] = useState<Array<object>>([]);
	const [fileName, setFileName] = useState<string>("");
	const [filePath, setFilePath] = useState<string>("");
	const [selectedButton, setSelectedButton] = useState("Data");
	const [modelType, setModelType] = useState("logistic_regression");
	const [learningType, setLearningType] = useState("supervised");

	const linearRegressionHeaders = ["Feature", "Coefficient", "P value"];
	const linearRegressionRowNames = ["Feature 1", "Feature 2", "Feature 3"];
	const linearRegressionData = [
		{ feature: "A", coefficient: 0.5, p_value: 0.02 },
		{ feature: "B", coefficient: -0.3, p_value: 0.05 },
		{ feature: "C", coefficient: 0.1, p_value: 0.12 },
	];

	const kMeansHeaders = ["Cluster ID", "Cluster Center", "Cluster Size"];
	const kMeansRowNames = ["Cluster 1", "Cluster 2", "Cluster 3"];
	const kMeansData = [
		{ cluster_id: 1, cluster_center: { A: 10, B: 20 }, cluster_size: 50 },
		{ cluster_id: 2, cluster_center: { A: 10, B: 20 }, cluster_size: 70 },
		{ cluster_id: 3, cluster_center: { A: 10, B: 20 }, cluster_size: 90 },
	];

	const logisticRegressionHeaders = [
		"Feature",
		"Coefficient",
		"Odds Ratio",
		"P value",
	];
	const logisticRegressionRowNames = ["Feature 1", "Feature 2", "Feature 3"];
	const logisticRegressionData = [
		{ feature: "Feature 1", coefficient: 1.2, odds_ratio: 3.3, p_value: 0.01 },
		{ feature: "Feature 2", coefficient: -0.7, odds_ratio: 0.5, p_value: 0.03 },
		{ feature: "Feature 3", coefficient: 0.4, odds_ratio: 1.5, p_value: 0.1 },
	];

	const csvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0];
			if (file) {
				Papa.parse<File, Papa.LocalFile>(file, {
					complete: async (results: ParseResult<File>) => {
						console.log(results);
						if (results.meta.fields) {
							setHeaders(results.meta.fields);
						}
						setBody(results.data);
						setFileName(file.name);
						setSelectedButton("Analytics");

						// Prepare the form data
						const formData = new FormData();
						formData.append("file", file);

						try {
							// Send the file to the backend
							const response = await axios.post(
								"http://localhost:5000/upload",
								formData,
								{
									headers: {
										"Content-Type": "multipart/form-data",
									},
								}
							);
							console.log("File successfully uploaded:", response.data);
							setFilePath(response.data.preprocessed_file); // Save preprocessed file path
						} catch (error) {
							console.error("Error uploading file:", error);
						}
					},
					header: true,
				});
			}
		}
	};

	const trainModel = async () => {
		try {
			const response = await axios.post("http://localhost:5000/train", {
				modelType: modelType,
				filePath: filePath,
				learningType: learningType,
			});

			console.log("Training result:", response.data);
			// Handle the training result, display to the user or update UI
		} catch (error) {
			console.error("Error training model:", error);
		}
	};

	return (
		<>
			<Sidebar
				modelType={modelType}
				setModelType={setModelType}
				trainModel={trainModel}
			/>
			<Navbar
				selectedButton={selectedButton}
				setSelectedButton={setSelectedButton}
			/>
			<div className="fixed top-4 right-16">
				<ModeToggle />
			</div>

			{/* body */}
			<div className="pl-[16rem]">
				{selectedButton === "Data" && <InputFile handleChange={csvUpload} />}

				{selectedButton === "Analytics" && (
					<div className="flex flex-col items-center justify-center pt-20">
						<div className="w-full flex flex-col items-center justify-center">
							<DataTable headers={headers} body={body} fileName={fileName} />
							<hr className="h-px w-full my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
							<AnalyticsTable
								headers={mockHeaders}
								rowNames={mockRowNames}
								rowData={mockRowData}
							/>
						</div>
					</div>
				)}

				{selectedButton === "Results" && (
					<div className="flex flex-col items-center justify-center pt-20">
						<div className="w-full flex flex-col items-center justify-center">
							<DataTable headers={headers} body={body} fileName={fileName} />
							<hr className="h-px w-full my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
							{modelType === "linear_regression" && (
								<ResultsTable
									headers={linearRegressionHeaders}
									rowNames={linearRegressionRowNames}
									rowData={linearRegressionData}
									modelType={modelType}
								/>
							)}
							{modelType === "kmeans" && (
								<ResultsTable
									headers={kMeansHeaders}
									rowNames={kMeansRowNames}
									rowData={kMeansData}
									modelType={modelType}
								/>
							)}
							{modelType === "logistic_regression" && (
								<ResultsTable
									headers={logisticRegressionHeaders}
									rowNames={logisticRegressionRowNames}
									rowData={logisticRegressionData}
									modelType={modelType}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default App;
