import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";

class AudioList extends Component {
  static contextType = AudioContext;

  layoutProvider = new LayoutProvider(
    () => "audio",
    (_, dim) => {
      dim.width = Dimensions.get("window").width;
      dim.height = 70;
    }
  );

  rowRenderer = (_, item) => {
    return <Text>{item.filename}</Text>;
  };

  render() {
    const { dataProvider } = this.context;
    return (
      <View style={{ flex: 1 }}>
        <RecyclerListView
          dataProvider={dataProvider}
          layoutProvider={this.layoutProvider}
          rowRenderer={this.rowRenderer}
        />
      </View>
    );
  }
}

export default AudioList;
