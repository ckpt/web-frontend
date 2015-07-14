"use strict";

var React = require("react");

var Authentication = require("../utils/Authentication");

var RulesPage = React.createClass({

  displayName: "Rules Page",
  mixins: [ Authentication ],

  getDefaultProps: function() {
    return {
      rules:
      [
        {
          section: "Lokalet og løsøre",
          icon: "glass",
          rules: [
            "Røyking er ikke tillatt innendørs",
            "Ulovlige rusmidler er ikke tillatt",
            "Fysisk vold mot motspillere er ikke tillatt",
            "Bruk gjesteparkeringen",
            "Solbriller er lov å bruke"
          ]
        },
        {
          section: "Ved bordet",
          icon: "users",
          rules: [
            "Side-bets er ikke lov",
            "Det er kun kort, sjetonger og drikke som er tillatt på pokerbordet",
            "Hold kort og sjetonger på bordet til enhver tid. Disse skal være synlig for andre spillere.",
            "Ikke rør motspillernes sjetonger eller kort",
            "Ikke bøy eller merk kortene på noen måte",
            "Kun engelsk og norsk språk et tillatt å snakke ved bordet",
            "Det er ikke lov å snakke i telefonen ved bordet",
            "Vær snill med motspillerne"
          ]
        },
        {
          section: "Spillet",
          icon: "dollar",
          rules: [
            "Alle spillerne starter med $1000 når turneringer starter",
            "Blinds øker hvert 20. eller 25. minutt, etter gjeldende struktur",
            "Husverten starter alltid som dealer i turneringer",
            "Plassering av spillere rundt bordet avgjøres ved å trekke kort",
            "Det er aldri noen rake",
            "Casino Kopperud kan avbryte turneringen når som helst",
            "Casino Kopperud kan fjerne en spiller når som helst for brudd på reglene",
            "Spill kun når det er din tur",
            "Ikke bruk for lang tid når det er din tur",
            "Annonser muntlig dine trekk i spillet",
            "Check-raising er lov, og oppfordres til!",
            "Avslør aldri kort som er kastet av en motspiller",
            "Det er kun lov å høyne tre ganger per runde"
          ]
        },
        {
          section: "Andre regler",
          icon: "book",
          rules: [
            "Spillere oppfordres til å drikke alkohol",
            "Bruk toalettet når du skal tisse - ikke vasken"
          ]
        }
      ]
    };
  },

  render: function() {

    var _renderSection = function(rules, j) {
      var list = [];
      for (var i = 0; i < rules.length; i++) {
        list.push(<li key={"rules-item-" + j + "-" + i}>{rules[i]}</li>);
      }
      return list;
    };

    return (
      <div id="page-wrapper">
        <div className="row">
          <p></p>
        </div>
        {this.props.rules.map(function(section, i) {
          return (
            <div className="row" key={"rules-section-" + i}>
              <div className="col-lg-12">
                <div className="panel panel-info">
                   <div className="panel-heading">
                      <h4><i className={"fa fa-" + section.icon + " fa-2x"}></i> {section.section}</h4>
                   </div>
                   <div className="panel-body">
                      {_renderSection(section.rules, i)}
                   </div>
                </div>
              </div>
            </div>
          );
         })}
      </div>
    );
  }
});

module.exports = RulesPage;
