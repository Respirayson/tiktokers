import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import DataTable from "./components/DataTable/DataTable";
import Sidebar from "./components/sidebar";
import Navbar from "./components/floating-navbar";
import { InputFile } from "./components/input-file";
import AnalyticsTable from "./components/AnalyticsTable/AnalyticsTable";
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
	const [modelType, setModelType] = useState("linear_regression");
	const [learningType, setLearningType] = useState("supervised");

	// Define mock data for linear regression
	const linearRegressionHeaders = ["Feature", "Coefficient", "P-value"];
	const linearRegressionRowNames = ["Feature 1", "Feature 2", "Feature 3"];
	const linearRegressionData = [
		{ feature: "Feature 1", coefficient: 0.5, pValue: 0.02 },
		{ feature: "Feature 2", coefficient: -0.3, pValue: 0.05 },
		{ feature: "Feature 3", coefficient: 0.1, pValue: 0.12 },
	];

	// Define mock data for K-Means clustering
	const kMeansHeaders = ["Cluster ID", "Cluster Center", "Cluster Size"];
	const kMeansRowNames = ["Cluster 1", "Cluster 2", "Cluster 3"];
	const kMeansData = [
		{ clusterId: 1, center: [10, 20], size: 50 },
		{ clusterId: 2, center: [30, 40], size: 70 },
		{ clusterId: 3, center: [50, 60], size: 90 },
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
								<AnalyticsTable
									headers={linearRegressionHeaders}
									rowNames={linearRegressionRowNames}
									rowData={linearRegressionData}
								/>
							)}
							{modelType === "kmeans" && (
								<AnalyticsTable
									headers={kMeansHeaders}
									rowNames={kMeansRowNames}
									rowData={kMeansData}
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
