import React from "react";
import "./App.css";
import axios from "axios";
import { Table, Tag, Card, Input, Button } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { createRequire } from "module";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      countries: [],
      columns: [
        {
          title: 'Flag',
          dataIndex: 'countryInfo.flag',
          key:'countryInfo',
          render:  (text,row) =><img className="image" src={row.countryInfo.flag}  />
       },
        {
          title: "Country",
          dataIndex: "country",
          key: "country",
          render: text => <p class="anchor">{text}</p>,
          ...this.getColumnSearchProps("country")
        },
        {
          title: "Cases",
          dataIndex: "cases",
          key: "cases",
          sorter: (a, b) => a.cases - b.cases
        },
        {
          title: "Today Cases",
          dataIndex: "todayCases",
          key: "todayCases",
          sorter: (a, b) => a.todayCases - b.todayCases
        },
        {
          title: "Deaths",
          dataIndex: "deaths",
          key: "deaths",
          sorter: (a, b) => a.deaths - b.deaths
        },
        {
          title: "Today Deaths",
          dataIndex: "todayDeaths",
          key: "todayDeaths",
          sorter: (a, b) => a.todayDeaths - b.todayDeaths
        },
        {
          title: "Recovered",
          dataIndex: "recovered",
          key: "recovered",
          sorter: (a, b) => a.recovered - b.recovered
        },
        {
          title: "Active Cases",
          dataIndex: "active",
          key: "active",
          sorter: (a, b) => a.active - b.active
        },
        {
          title: "Serious Cases",
          dataIndex: "critical",
          key: "critical",
          sorter: (a, b) => a.critical - b.critical
        }
        // {
        //   title: "Address",
        //   dataIndex: "address",
        //   key: "address"
        // },
        // {
        //   title: "Tags",
        //   key: "tags",
        //   dataIndex: "tags",
        //   render: tags => (
        //     <span>
        //       {tags.map(tag => {
        //         let color = tag.length > 5 ? "geekblue" : "green";
        //         if (tag === "loser") {
        //           color = "volcano";
        //         }
        //         return (
        //           <Tag color={color} key={tag}>
        //             {tag.toUpperCase()}
        //           </Tag>
        //         );
        //       })}
        //     </span>
        //   )
        // },
        // {
        //   title: "Action",
        //   key: "action",
        //   render: (text, record) => (
        //     <span>
        //       <a style={{ marginRight: 16 }}>Invite {record.name}</a>
        //       <a>Delete</a>
        //     </span>
        //   )
        // }
      ]
    };
  }
  componentDidMount() {
    axios.get("https://corona.lmao.ninja/all").then(result => {
      this.setState({
        data: result.data
      });
    });

    axios
      .get("https://corona.lmao.ninja/countries?sort=country")
      .then(result => {
        console.log(result)
        function compare(a, b) {
          // Use toUpperCase() to ignore character casing
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
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <a>
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        </a>
      ) : (
        <a> {text}</a>
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
          
        </div>
        <Table
        rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
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
      </Card>
    );
  }
}

export default App;
