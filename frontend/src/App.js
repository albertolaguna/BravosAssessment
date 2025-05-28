import { useState } from "react";
import "./App.css";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
	const [breeds, setBreeds] = useState([]);
	const [filteredBreeds, setFilteredBreeds] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterText, setFilterText] = useState("");

	const breedsPerPage = 5;

	const fetchBreeds = async () => {
		const response = await fetch("http://localhost:5000/breeds");
		const data = await response.json();
		if (data && data.data) {
			setBreeds(data.data);
			setFilteredBreeds(data.data);
			setCurrentPage(1);
		}
	};

	const handleFilterChange = (e) => {
		const value = e.target.value.toLowerCase();
		setFilterText(value);
		const filtered = breeds.filter((breed) =>
			breed.attributes.name.toLowerCase().includes(value)
		);
		setFilteredBreeds(filtered);
		setCurrentPage(1);
	};

	const paginatedBreeds = filteredBreeds.slice(
		(currentPage - 1) * breedsPerPage,
		currentPage * breedsPerPage
	);

	const totalPages = Math.ceil(filteredBreeds.length / breedsPerPage);

	const handlePageChange = (newPage) => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const chartBreeds = filteredBreeds
		.filter(
			(b) =>
				b.attributes.life &&
				typeof b.attributes.life.min === "number" &&
				typeof b.attributes.life.max === "number"
		)
		.slice(0, 10);

	const chartData = {
		labels: chartBreeds.map((b) => b.attributes.name),
		datasets: [
			{
				label: "Average Lifespan",
				data: chartBreeds.map((b) =>
					(
						(b.attributes.life.min + b.attributes.life.max) /
						2
					).toFixed(1)
				),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
			},
		],
	};

	return (
		<div className="App">
			<h1>Dog Breeds Viewer</h1>
			<button onClick={fetchBreeds}>Load Dog Breeds</button>
			<br />
			<br />
			<input
				type="text"
				value={filterText}
				onChange={handleFilterChange}
				placeholder="Filter breeds..."
			/>
			<br />
			<br />
			<table>
				<thead>
					<tr>
						<th>Breed Name</th>
						<th>Lifespan</th>
						<th>Hypoallergenic</th>
					</tr>
				</thead>
				<tbody>
					{paginatedBreeds.map((breed) => (
						<tr key={breed.id}>
							<td>{breed.attributes.name}</td>
							<td>
								{breed.attributes.life
									? `${breed.attributes.life.min} - ${breed.attributes.life.max} years`
									: "Unknown"}
							</td>
							<td>
								{breed.attributes.hypoallergenic ? "Yes" : "No"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="pagination">
				<button onClick={() => handlePageChange(currentPage - 1)}>
					Prev
				</button>
				<span>
					{" "}
					Page {currentPage} of {totalPages}{" "}
				</span>
				<button onClick={() => handlePageChange(currentPage + 1)}>
					Next
				</button>
			</div>

			<h2>Avg Lifespan Chart (Top 10)</h2>
			<div style={{ maxWidth: "600px", margin: "auto" }}>
				<Bar data={chartData} />
			</div>
		</div>
	);
}

export default App;
