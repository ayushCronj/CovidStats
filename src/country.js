import React from "react";
import "./App.css";
import axios from "axios";
import { Table, Tag, Card, Input, Button } from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  LinkedinOutlined,
  FacebookOutlined
} from "@ant-design/icons";
import { HomeFilled } from "@ant-design/icons";
import { Redirect } from "react-router-dom";

export class Country extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      countries: [],
      columns: [
        {
          title: "Date",
          dataIndex: "date",
          key: "date"
          //   render: (text, row) => (
          //     <img className="image" src={row.countryInfo.flag} />
          //   )
        },
        {
          title: "Confirmed Cases",
          dataIndex: "confirmed",
          key: "confirmed",
          sorter: (a, b) => a.confirmed - b.confirmed
          //   render: text => <p class="anchor">{text}</p>,
          //   ...this.getColumnSearchProps("country")
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
          this.setState({
            data: data[some || this.props.location.state.country].reverse()
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

        <div className="mainCard">
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

        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          columns={this.state.columns}
          dataSource={this.state.data}
          bordered
          pagination={{ defaultPageSize: 30 }}
          // tableLayout = "fixed"
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
