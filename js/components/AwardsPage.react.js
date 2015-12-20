"use strict";

var React = require("react");

var StatsStore = require("../stores/StatsStore.react");
var StatsActionCreators = require("../actions/StatsActionCreators.react");
var PlayerStore = require("../stores/PlayerStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");

var Authentication = require("../utils/Authentication");

var SeasonAwardsPanel = require("./SeasonAwardsPanel.react.js");

var Carousel = require("react-bootstrap").Carousel
var CarouselItem = require("react-bootstrap").CarouselItem
var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var AwardsPage = React.createClass({

  displayName: "Awards Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      titles: StatsStore.getTitles(),
      errors: []
    };
  },

  componentDidMount: function() {
    StatsStore.addChangeListener(this._onChange);
    PlayerStore.addChangeListener(this._onChange);
    PlayerActionCreators.loadPlayers();
    StatsActionCreators.loadAll();
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    StatsStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      titles: StatsStore.getTitles(),
      errors: [
        StatsStore.getErrors() +
        PlayerStore.getErrors()
      ]
    });
  },

  _lookupHostPlayerNick: function(uuid) {
    var player = PlayerStore.getFromUUID(uuid);
    if (player && player.nick) {
      return {nick: player.nick, pic: player.profile.picture};
    }
    return {nick: null, pic: null};
  },

  _makeItem: function(season, pic, nick, background) {
    return (
      <CarouselItem key={"citem-" + season + "-" + nick}>
  <img width="100%" src={background}/>
  <div className='carousel-caption text-center'>
    {pic ? <img width="140px" height="140px" style={{border: "1px solid white"}} src={"data:image/png;base64," + pic} /> : ""}
    <h1>{nick} - {season}</h1>
  </div>
</CarouselItem>
    );
  },

  _makeCarousel: function(titles) {
    var items = [];
    var pics = [
//"https://farm8.staticflickr.com/7301/15862125374_c8fb1f34d6_c.jpg",
"images/cash_pile.jpg"
    ];

    for (var i = 0; i < titles.length; i++) {
      var champ = titles[i].champion;
      var season = titles[i].season;
      var pData = this._lookupHostPlayerNick(champ.uuid);

      items.push(this._makeItem(season, pData.pic, pData.nick, _.sample(pics)));
    }
    return items;
  },

  _makeRows: function(titles) {
    var rows = [];
    var currentrow = [];

    for (var i = 0; i < titles.length; i++) {
      var keys = _.keys(titles[i]);
      for (var j = 0; j < keys.length; j++) {
        if (!_.has(titles[i][keys[j]], "uuid")) {
          continue;
        }
        var pData = this._lookupHostPlayerNick(titles[i][keys[j]].uuid);
        titles[i][keys[j]].nick = pData.nick;
        titles[i][keys[j]].pic = pData.pic;
      }

      var season = titles[i].season;
      var awards = <SeasonAwardsPanel awards={titles[i]} season={season} key={"awardspanel-" + i} />;
      currentrow.push(awards);
      if ( (i + 1) % 2 === 0 ) {
        rows.push(_.clone(currentrow));
        currentrow = [];
      }
    }

    if (currentrow.length) {
      rows.push(_.clone(currentrow));
    }
    return rows;
  },

  render: function() {
    var currentSeason = this.props.currentSeason;
    var completedSeasons = _.reject(this.state.titles, function(t) { return t.season >= currentSeason; });
    var awardrows = this._makeRows(_.sortBy(completedSeasons, function(t) { return -t.season; }));
    var carouselitems = this._makeCarousel(_.sortBy(completedSeasons, function(t) { return -t.season; }));

    return (
      <div id="page-wrapper">
        <div className="row">
          <p></p>
          <div className="col-lg-12 hidden-sm hidden-xs">
                <Carousel controls={false} pauseOnHover={false}>
                  {carouselitems}
                </Carousel>
          </div>
        </div>
        {awardrows.map(function(row, i) {
          return (
            <div className="row" key={"award-row-" + i}>
            <p></p>
              {row}
            </div>
          );
         })}
      </div>
    );
  }
});

module.exports = AwardsPage;
