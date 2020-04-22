import React from "react";
import "./App.css";
import { Table, Card } from "antd";
import { LinkedinOutlined, FacebookOutlined } from "@ant-design/icons";
import { HomeFilled } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

export class Country extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			series: [],
			options: {},
			series1: [],
			options1: {},
			series2: [],
			options2: {},
			data: [],
			countries: [],
			columns: [
				{
					title: "Date",
					dataIndex: "date",
					key: "date"
				},
				{
					title: "Confirmed Cases",
					dataIndex: "confirmed",
					key: "confirmed",
					sorter: (a, b) => a.confirmed - b.confirmed
				},
				{
					title: "Recovered Cases",
					dataIndex: "recovered",
					key: "recovered",
					sorter: (a, b) => a.recovered - b.recovered
				},
				{
					title: "Deaths",
					dataIndex: "deaths",
					key: "deaths",
					sorter: (a, b) => a.deaths - b.deaths
				},
				{
					title: "Active Cases",
					dataIndex: "active",
					key: "active",
					sorter: (a, b) =>
						a.confirmed -
						a.recovered -
						a.deaths -
						b.confirmed -
						b.recovered -
						b.deaths,
					render: (text, row) => (
						<p> {row.confirmed - row.recovered - row.deaths}</p>
					)
				}
			]
		};
	}
	componentDidMount() {
		fetch("https://pomber.github.io/covid19/timeseries.json")
			.then(response => response.json())
			.then(data => {
				let some = null;
				if (this.props.location.state.country === "USA") {
					some = "US";
				} else if (this.props.location.state.country === "UK") {
					some = "United Kingdom";
				} else if (this.props.location.state.country === "S. Korea") {
					some = "Korea, South";
				}
				if (data[some || this.props.location.state.country]) {
					let data1 = data[some || this.props.location.state.country];
					let seriesData = [];
					data1.forEach((element, index) => {
						if (index % 2 == 0 && index > 44) {
							seriesData.push(element.confirmed);
						}
					});
					let optionData = [];
					data1.forEach((element, index) => {
						if (index % 2 == 0 && index > 44) {
							optionData.push(element.date);
						}
					});

					let seriesData2 = [];
					data1.forEach((element, index) => {
						if (index % 2 == 0 && index > 44) {
							seriesData2.push(element.deaths);
						}
					});

					let seriesData3 = [];
					data1.forEach((element, index) => {
						if (index % 2 == 0 && index > 44) {
							console.log(element);
							seriesData3.push(element.recovered);
						}
					});

					this.setState({
						data: data[some || this.props.location.state.country].reverse(),
						series: [
							{
								name: "Confirmed Cases",
								data: seriesData
							}
						],
						options: {
							chart: {
								height: 350,
								type: "line",
								zoom: {
									enabled: false
								}
							},
							dataLabels: {
								enabled: false
							},
							stroke: {
								curve: "straight"
							},
							title: {
								text: "Confirmed Cases",
								align: "left"
							},
							grid: {
								row: {
									colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
									opacity: 0.5
								}
							},
							xaxis: {
								categories: optionData
							}
						},

						series1: [
							{
								name: "Deaths",
								data: seriesData2
							}
						],
						options1: {
							chart: {
								height: 350,
								type: "line",
								zoom: {
									enabled: false
								}
							},
							colors: ["#FF0000"],
							dataLabels: {
								enabled: false
							},
							stroke: {
								curve: "straight"
							},
							title: {
								text: "Deaths",
								align: "left"
							},
							grid: {
								row: {
									colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
									opacity: 0.5
								}
							},
							xaxis: {
								categories: optionData
							}
						},
						series2: [
							{
								name: "Recovered",
								data: seriesData3
							}
						],
						options2: {
							chart: {
								height: 350,
								type: "line",
								zoom: {
									enabled: false
								}
							},
							colors: ["#00FF00"],
							dataLabels: {
								enabled: false
							},
							stroke: {
								curve: "straight"
							},
							title: {
								text: "Recovered",
								align: "left"
							},
							grid: {
								row: {
									colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
									opacity: 0.5
								}
							},
							xaxis: {
								categories: optionData
							}
						}
					});
				} else {
					this.setState({
						data: []
					});
				}
			});
	}

	goBack = () => {
		this.setState({
			back: true
		});
	};

	render() {
		if (this.state.back) {
			return <Redirect to="/" />;
		}
		return (
			<Card className="Country">
				<div className="flex">
					{this.props.location && this.props.location.state ? (
						<div className="cardCountry">
							<img
								className="image1"
								src={this.props.location.state.countryInfo.flag}
							/>
							{this.props.location.state.country}{" "}
						</div>
					) : null}
					<HomeFilled
						style={{ fontSize: 30 }}
						onClick={() => {
							this.goBack();
						}}
					/>
				</div>

				<div className="mainCard1">
					<Card className="card">
						{this.props.location && this.props.location.state ? (
							<div>Total Cases - {this.props.location.state.cases} </div>
						) : null}
					</Card>
					<Card className="cardred">
						{this.props.location && this.props.location.state ? (
							<div>Total Deaths - {this.props.location.state.deaths} </div>
						) : null}
					</Card>
					<Card className="cardgreen">
						{this.props.location && this.props.location.state ? (
							<div>
								Total Recovered - {this.props.location.state.recovered}{" "}
							</div>
						) : null}
					</Card>
				</div>

				<div className="mainCard">
					<div className="chart">
						<ReactApexChart
							options={this.state.options}
							series={this.state.series}
							type="line"
							height={250}
							// width={645}
						/>
					</div>

					<div className="chart">
						<ReactApexChart
							options={this.state.options1}
							series={this.state.series1}
							type="line"
							height={250}
							// width={645}
						/>
					</div>

					<div className="chart">
						<ReactApexChart
							options={this.state.options2}
							series={this.state.series2}
							type="line"
							height={250}
							// width={645}
						/>
					</div>
				</div>

				<Table
					rowClassName={(record, index) =>
						index % 2 === 0 ? "table-row-light" : "table-row-dark"
					}
					columns={this.state.columns}
					dataSource={this.state.data}
					bordered
					pagination={{ defaultPageSize: 30 }}
					scroll={{ x: 240 }}
				/>

				<Card className="card2">
					<div>Website By - Ayush Goel</div>
					<a href="https://www.linkedin.com/in/ayush-goel-2609/">
						{" "}
						<LinkedinOutlined style={{ fontSize: 22, color: "#0e76a8" }} />
					</a>
					<a href="https://www.facebook.com/AwesomeAyushGoel">
						<FacebookOutlined style={{ fontSize: 22, color: "#3b5998" }} />{" "}
					</a>
				</Card>
			</Card>
		);
	}
}

export default Country;
