import React from "react";
import axios from "axios";

type FibState = {
  seenIndexes: Array<{ number: number }>;
  values: { [key: string]: number };
  index: string;
};

class Fib extends React.Component<object, FibState> {
  state: FibState = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const response = await axios.get("/api/values/all");
    const seenIndexes = Array.isArray(response.data) ? response.data : [];
    console.log('show seenIndexes:', seenIndexes);
    this.setState({seenIndexes});
  }
  handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('✅✅✅Submitting index:', this.state.index);
    await axios.post("/api/values", {
      index: this.state.index,
    });
    this.setState({ index: "" });
  }
  renderSeenIndexes() {
    console.log('Rendering seen indexes:', this.state.seenIndexes);
    return this.state.seenIndexes.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const entries = [];
    for (const key in this.state.values) {
      entries.push(
        <div key={key}>
         {this.state.values[key]}
        </div>,
      );
    }
    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter you index: </label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit </button>
        </form>
        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}
        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;