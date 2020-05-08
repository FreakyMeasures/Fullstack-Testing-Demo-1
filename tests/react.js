/* eslint-env mocha */
import React from "react";
import { expect } from "chai";
import axios from "axios";
import { mount, shallow } from "enzyme";
import { mockAxios } from "./setup";
import waitForExpect from "wait-for-expect";

const MyOtherComponent = () => {
  return (
    <div>
      <h1>Hello Finn and Travis</h1>
    </div>
  );
};

class SimpleComp extends React.Component {
  constructor() {
    super();
    this.state = {
      sandwiches: [],
      loading: true,
    };
  }
  async componentDidMount() {
    const response = await axios.get("/api/sandwiches");
    // console.log(response)
    this.setState({ sandwiches: response.data, loading: false });
  }
  render() {
    const { name } = this.props;
    const { sandwiches, loading } = this.state;
    // console.log("loading", loading);
    if (loading) {
      return <div>Loading....</div>;
    }
    return (
      <div>
        <div>Hello, {name}</div>
        <ul>
          {sandwiches.map((sandwich) => {
            return <li key={sandwich.id}>{sandwich.name}</li>;
          })}
        </ul>
      </div>
    );
  }
}

describe.only("React", () => {
  beforeEach(() => {
    mockAxios.reset();
    mockAxios.onGet("/api/sandwiches").reply(200, [
      { id: 1, name: "italian grinder" },
      { id: 2, name: "turkey" },
      { id: 3, name: "tuna" },
    ]);
  });

  it("renders component from props", async () => {
    // do test here
    const wrapper = mount(<SimpleComp name="Finn" />);
    // console.log(wrapper);
    // console.log(wrapper.props());
    // expect(wrapper.props())
    await waitForExpect(() => {
      expect(wrapper.html()).to.include("Finn");
      expect(wrapper.html()).to.not.include("Travis");
    });
    // expect(wrapper.find("Finn")).to.have.lengthOf(1);
    // expect(wrapper.find("Travis")).to.have.lengthOf(0);
  });

  it("ACTUALLY renders component from props", async () => {
    // do test here
    const wrapper = mount(<SimpleComp name="Travis" />);
    // console.log(wrapper.html());
    await waitForExpect(() => {
      expect(wrapper.html()).to.include("Travis");
      expect(wrapper.html()).to.not.include("Finn");
    });
  });

  it("retrieves data from /api/sandwiches after mounting", async () => {
    const wrapper = mount(<SimpleComp name="Priti" />);
    await waitForExpect(() => {
      expect(wrapper.html()).to.include("italian grinder");
      expect(mockAxios.history.get).to.have.lengthOf(1);
    });
  });
});
