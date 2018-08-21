import React from "react";
import { Button, Header, Icon,Modal as SiModel } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// This example shows how to render two different screens
// (or the same screen in a different context) at the same url,
// depending on how you got there.
//
// Click the colors and see them full screen, then "visit the
// gallery" and click on the colors. Note the URL and the component
// are the same as before but now we see them inside a modal
// on top of the old screen.

class ModalSwitch extends React.Component {
  // We can pass a location to <Switch/> that will tell it to
  // ignore the router's current location and use the location
  // prop instead.
  //
  // We can also use "location state" to tell the app the user
  // wants to go to `/img/2` in a modal, rather than as the
  // main page, keeping the gallery visible behind it.
  //
  // Normally, `/img/2` wouldn't match the gallery at `/`.
  // So, to get both screens to render, we can save the old
  // location and pass it to Switch, so it will think the location
  // is still `/` even though its `/img/2`.
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render
    return (
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={Home} />
          {/* <Route path="/gallery" component={Gallery} /> */}
          <Route path="/img/:id" component={ImageView} />
        </Switch>
        {isModal ? <Route path="/img/:id" component={Modal} /> : null}
      </div>
    );
  }
}

const IMAGES = [
  { id: 0, title: "Dark Orchid", color: "DarkOrchid" },
  { id: 1, title: "Lime Green", color: "LimeGreen" },
  { id: 2, title: "Tomato", color: "Tomato" },
  { id: 3, title: "Seven Ate Nine", color: "#789" },
  { id: 4, title: "Crimson", color: "Crimson" }
];

const Thumbnail = ({ color }) => (
  <div
    style={{
      width: 50,
      height: 50,
      background: color
    }}
  />
);

const Image = ({ color }) => (
  <div
    style={{
      width: "100%",
      height: 400,
      background: color
    }}
  />
);

const Home = () => (
  <div>
    {IMAGES.map(i => (
      <Link
        key={i.id}
        to={{
          pathname: `/img/${i.id}`,
          // this is the trick!
          state: { modal: true }
        }}
      >
        <Thumbnail color={i.color} />
        <p>{i.title}</p>
      </Link>
    ))}
  </div>
);

const ImageView = ({ match }) => {
  const image = IMAGES[parseInt(match.params.id, 10)];
  if (!image) {
    return <div>Image not found</div>;
  }

  return (
    <div>
      <h1>{image.title}</h1>
      <Image color={image.color} />
    </div>
  );
};

const Modal = ({ match, history }) => {
  const image = IMAGES[parseInt(match.params.id, 10)];
  if (!image) {
    return null;
  }
  const back = e => {
    e.stopPropagation();
    history.goBack();
  };
  return (
    <SiModel trigger={<Button>Long SiModel</Button>}>
      <SiModel.Header>Profile Picture</SiModel.Header>
      <SiModel.Content image>
        <Image wrapped size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' />
        <SiModel.Description>
          <Header>SiModel Header</Header>
          <p>This is an example of expanded content that will cause the SiModel's dimmer to scroll</p>
        </SiModel.Description>
      </SiModel.Content>
      <SiModel.Actions>
        <Button primary>
          Proceed <Icon name='right chevron' />
        </Button>
      </SiModel.Actions>
    </SiModel>
  );
};

const ModalGallery = () => (
  <Router>
    <Route component={ModalSwitch} />
  </Router>
);

export default ModalGallery;