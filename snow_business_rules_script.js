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

/*
 * Notes:
 *
 * This script is a ServiceNow Business Rule — it runs server-side on a sc_req_item (RITM)
 * table event and uses sn_ws.RESTMessageV2 to call a pre-configured REST Message definition,
 * keeping credentials out of the script itself.
 *
 * The current.variables loop is the key EDA integration point: it dynamically forwards all
 * catalog item variable answers as top-level JSON keys, so the Ansible rulebook receives them
 * without needing per-variable mapping on the ServiceNow side.
 *
 * r.setTimeout(10000) with synchronous r.execute() (not executeAsync()) means a slow EDA
 * endpoint will block the Business Rule transaction for up to 10 seconds — worth switching
 * to executeAsync() if response time becomes an issue.
 */
