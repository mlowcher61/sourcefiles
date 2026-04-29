(function executeRule(current, previous) {
  var REST_MESSAGE_NAME = 'Ame - Event Driven Ansible - proddemos';
  var EVENT_NAME = "SERVICE_CATALOG";

  var r = new sn_ws.RESTMessageV2(REST_MESSAGE_NAME, "POST");

  var json = { event: EVENT_NAME };

  if (current.cat_item) {
    json["catalog_item"] = current.cat_item.getDisplayValue();
  }

  if (current.number) {
    json["number"] = current.number.getDisplayValue();
  }

  if (current.sys_id) {
    json["sys_id"] = current.sys_id.getValue("sys_id");
  }

  if (current.state) {
    json["state"] = current.state.getDisplayValue();
  }

  if (current.short_description) {
    json["short_description"] = current.short_description.getValue("short_description");
  }

  if (current.stage) {
    json["stage"] = current.stage.getDisplayValue();
  }

  if (current.opened_by) {
    var requester = current.opened_by.getRefRecord();
    if (requester.isValidRecord()) {
      json["requester"] = requester.getValue("email");
    }
  }

  for (var key in current.variables) {
    if (current.variables.hasOwnProperty(key)) {
      var variable = current.variables[key];
      json[key] =
        variable.getDisplayValue() != null
          ? variable.getDisplayValue()
          : JSON.parse(String(variable));
    }
  }

  var jsonString = JSON.stringify(json);
  r.setRequestBody(jsonString);
  r.setTimeout(10000);
  r.execute();
})(current, previous);
