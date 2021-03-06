import React from "react";
import "./App.css";
import axios from "axios";
import { Table, Card, Input, Button } from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  LinkedinOutlined,
  FacebookOutlined
} from "@ant-design/icons";
import { Redirect } from "react-router-dom";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      countries: [],
      columns: [
        {
          title: "Flag",
          dataIndex: "countryInfo.flag",
          key: "countryInfo",
          render: (text, row) => (
            <img
              className="image"
              src={row.countryInfo.flag}
              alt={row.country}
            />
          )
        },
        {
          title: "Country",
          dataIndex: "country",
          key: "country",
          render: text => <p class="anchor">{text}</p>,
          ...this.getColumnSearchProps("country")
        },
        {
          title: "Total Cases",
          dataIndex: "cases",
          key: "cases",
          sorter: (a, b) => a.cases - b.cases
        },
        {
          title: "Today Cases",
          dataIndex: "todayCases",
          key: "todayCases",
          sorter: (a, b) => a.todayCases - b.todayCases,
          render: text => <p style={{color:"blue", fontWeight:"bold"}}>{text}</p>,
        },
        {
          title: "Total Deaths",
          dataIndex: "deaths",
          key: "deaths",
          sorter: (a, b) => a.deaths - b.deaths
        },
        {
          title: "Today Deaths",
          dataIndex: "todayDeaths",
          key: "todayDeaths",
          sorter: (a, b) => a.todayDeaths - b.todayDeaths,
          render: text => <p style={{color:"red", fontWeight:"bold"}}>{text}</p>,
        },
        {
          title: "Recovered",
          dataIndex: "recovered",
          key: "recovered",
          sorter: (a, b) => a.recovered - b.recovered,
          render: text => <p style={{color:"green", fontWeight:"bold"}}>{text}</p>,
        },
        {
          title: "Active Cases",
          dataIndex: "active",
          key: "active",
          sorter: (a, b) => a.active - b.active
        },
        {
          title: "Total Tests",
          dataIndex: "tests",
          key: "tests",
          sorter: (a, b) => a.tests - b.tests,
          render: text => <p style={{color:"gray", fontWeight:"bold"}}>{text}</p>,
        },
        {
          title: "Serious Cases",
          dataIndex: "critical",
          key: "critical",
          sorter: (a, b) => a.critical - b.critical
        }
      ]
    };
  }
  componentDidMount() {
    axios.get("https://corona.lmao.ninja/v2/all").then(result => {
      this.setState({
        data: result.data
      });
    });

    axios
      .get("https://corona.lmao.ninja/v2/countries?sort=country")
      .then(result => {
        function compare(a, b) {
          const casesA = a.cases;
          const casesB = b.cases;

          let comparison = 0;
          if (casesA > casesB) {
            comparison = -1;
          } else if (casesA < casesB) {
            comparison = 1;
          }
          return comparison;
        }

        result.data.sort(compare);

        this.setState({
          countries: result.data
        });
      });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text, row) =>
      this.state.searchedColumn === dataIndex ? (
        <a
          onClick={() => {
            this.setState({
              redirect: true,
              countryName: row
            });
          }}
        >
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        </a>
      ) : (
        <a
          onClick={() => {
            this.setState({
              redirect: true,
              countryName: row
            });
          }}
        >
          {" "}
          {text}
        </a>
      )
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/country",
            state: this.state.countryName
          }}
        />
      );
    }
    return (
      <Card className="App">
        <div className="mainCard">
          <Card className="card">
            {this.state.data.cases ? (
              <div>Total Cases - {this.state.data.cases} </div>
            ) : null}
          </Card>
          <Card className="cardred">
            {this.state.data.deaths ? (
              <div>Total Deaths - {this.state.data.deaths} </div>
            ) : null}
          </Card>
          <Card className="cardgreen">
            {this.state.data.recovered ? (
              <div>Total Recovered - {this.state.data.recovered} </div>
            ) : null}
          </Card>
          <Card className="cardgray">
            {this.state.data.recovered ? (
              <div>Total Tests Conducted - {this.state.data.tests} </div>
            ) : null}
          </Card>
        </div>
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          columns={this.state.columns}
          dataSource={this.state.countries}
          bordered
          pagination={{ defaultPageSize: 30 }}
          // tableLayout = "fixed"
          scroll={{ x: 240 }}
        />

        <Card className="card1">
          {this.state.data.updated ? (
            <div>
              Last Updated - {new Date(this.state.data.updated).toString()}{" "}
            </div>
          ) : null}
        </Card>

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

export default App;
