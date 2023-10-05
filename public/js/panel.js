var io = io("http://" + "127.0.0.1" + ":" + port + "/");
function loadMatch(data) {
  loadTeams(teams => {
    $teamList = $("#team_1, #team_2");
    $teamList.html("<option value=null>NONE</option><option value='auto' selected>Try to match team automatically</option>");

    //$mapList = $("#Agency, #Ancient, #Anubis, #Cache, #Dust_2, #Inferno, #Mirage, #Nuke, #Office, #Overpass, #Train, #Tuscan, #Vertigo")
    $mapList = $("#maptype");
    $mapList.html("<option value=null, selected>Team that chose the map</option>");

    teams.forEach(function(team, id) {
      let $option = $("<option value='" + team._id + "'>" + team.team_name + " (" + team.short_name + ")</option>");
      if (team.logo) {
        $option.attr("data-icon", "/storage/" + team.logo);
      }
      $teamList.append($option);
    }, this);
    teams.forEach(function(team, id) {
      let $option = $("<option value='" + team.short_name + "'>" + team.team_name + " (" + team.short_name + ")</option>");
      if (team.logo) {
        $option.attr("data-icon", "/storage/" + team.logo);
      }
      $mapList.append($option);
    }, this);
    if (data) {
      $("#botype").val(data.match);
      $("#maptype")
        .val(data.maptype);
      $("#team_1_score")
        .val("0")
        .val(data.team_1.map_score);
      $("#team_2_score")
        .val("0")
        .val(data.team_2.map_score);
      $("#team_1")
        .val("auto")
        .val(data.team_1.team);
      $("#team_2")
        .val("auto")
        .val(data.team_2.team);
    }
    $("select").formSelect();
  });
}
$(document).ready(() => {
  $("#set").click(() => {
    let match = {
      match: $("#botype").val(),
      maptype: $("#maptype").val(),
      team_1: {
        map_score: $("#team_1_score").val(),
        team: $("#team_1").val()
      },
      team_2: {
        map_score: $("#team_2_score").val(),
        team: $("#team_2").val()
      }
    };
    io.emit("update_match", match);
  });
  $("#swap").click(() => {
    let match = {
      match: $("#botype").val(),
      maptype: $("#maptype").val(),
      team_2: {
        map_score: $("#team_1_score").val(),
        team: $("#team_1").val()
      },
      team_1: {
        map_score: $("#team_2_score").val(),
        team: $("#team_2").val()
      }
    };
    io.emit("update_match", match);
  });
  $("#ref").click(() => {
    io.emit("refresh", true);
  });
  io.on("match", loadMatch);
  loadMatch();
  io.emit("ready", true);
});
