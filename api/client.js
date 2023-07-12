import axios from "axios";
export async function custom_axios({
	task,
	body = {},
	content_type_json = true,
	responseType = undefined,
}) {
	var api_endpoint = window.api_endpoint;
	var method = "POST"; // case insensitive,
	var route = "/";
	var headers = {
		task,
	};
	if (content_type_json) {
		headers["Content-Type"] = "application/json";
	}
	var conf = {
		url: new URL(route, api_endpoint).href,
		method: method.toUpperCase(),
		data: body,
		headers,
	};
	if (responseType) {
		conf.responseType = responseType;
	}
	var response = await axios(conf);

	return response.data;
}
var mongo_db_filter_function = ({ item, filters }) => {
	//it works like how find method of mongo db works.
	//for example when filters = {_id :"foo",user_id : "bar"} it returns true only if (item._id == "foo" && user_id == "bar")
	//note : item._id must be an string (.toArray() of mongo db also does this conversion)
	for (var filter in filters) {
		if (item[filter] !== filters[filter]) {
			return false;
		}
	}
	return true;
};
export var get_collection = ({ collection_name, filters, global_data }) => {
	if (global_data !== undefined) {
		return global_data.all[collection_name].filter((item) =>
			mongo_db_filter_function({ item, filters })
		);
	} else {
		return custom_axios({
			task: "get_collection",
			body: {
				collection_name,
				filters,
			},
		});
	}
};
export var custom_get_collection = ({ context, user_id, global_data }) => {
	if (global_data !== undefined) {
		return global_data.all[context].filter((i) =>
			i.collaborators.map((j) => j.user_id).includes(user_id)
		);
	} else {
		return custom_axios({
			task: "custom_get_collection",
			body: {
				context,
				user_id,
			},
		});
	}
};
export var delete_document = ({ collection_name, filters }) =>
	custom_axios({
		task: "delete_document",
		body: {
			filters,
			collection_name,
		},
	});
export var new_document = ({ collection_name, document }) =>
	custom_axios({
		task: "new_document",
		body: {
			collection_name,
			document,
		},
	});
export var update_document = ({ collection, update_filter, update_set }) =>
	custom_axios({
		task: "update_document",
		body: {
			collection,
			update_filter,
			update_set,
		},
	});

export var new_user = ({ body }) => new_document({ collection_name: "users", document: body });

export var get_users = ({ filters = {}, global_data }) =>
	get_collection({ collection_name: "users", filters, global_data });

export var delete_user = ({ user_id }) =>
	delete_document({
		collection_name: "users",
		filters: {
			_id: user_id,
		},
	});

export var new_note = ({ collaborators, title, pack_id }) =>
	new_document({
		collection_name: "notes",
		document: {
			collaborators,
			title,
			init_date: new Date().getTime(),
			pack_id,
			creation_time: new Date().getTime(),
		},
	});
export var new_pack = async ({ title, description, collaborators, pack_id /* either null or string */ }) =>
	new_document({
		collection_name: "packs",
		document: {
			init_date: new Date().getTime(),
			title,
			description,
			collaborators,
			pack_id,
			creation_time: new Date().getTime(),
		},
	});
export var new_task = ({
	linked_notes,
	end_date,
	pack_id,
	collaborators,
	start_date,
	title,
	category_id,
	description,
}) =>
	new_document({
		collection_name: "tasks",
		document: {
			init_date: new Date().getTime(),
			linked_notes,
			end_date,
			pack_id,
			collaborators,
			creation_time: new Date().getTime(),
			start_date,
			title,
			category_id,
			description,
		},
	});
export var new_calendar_category = ({ user_id, color, name }) =>
	new_document({
		collection_name: "calendar_categories",
		document: {
			user_id,
			color,
			name,
		},
	});
export var get_calendar_categories = ({ user_id, global_data }) =>
	get_collection({
		collection_name: "calendar_categories",
		filters: {
			user_id,
		},
		global_data,
	});

export var get_user_events = ({ user_id, global_data }) =>
	get_collection({
		collection_name: "events",
		filters: {
			user_id,
		},
		global_data,
	});
export var delete_task = ({ task_id }) =>
	delete_document({
		collection_name: "tasks",
		filters: {
			_id: task_id,
		},
	});
export var delete_event = ({ event_id }) =>
	delete_document({
		filters: {
			_id: event_id,
		},
		collection_name: "events",
	});
export var new_event = ({ collaborators, end_date, user_id, start_date, title, category_id }) =>
	new_document({
		collection_name: "events",
		document: {
			init_date: new Date().getTime(),
			end_date,
			user_id,
			creation_time: new Date().getTime(),
			start_date,
			title,
			category_id,
			collaborators,
		},
	});
export var update_note = ({ note_id, update_set }) =>
	update_document({
		collection: "notes",
		update_filter: {
			_id: note_id,
		},
		update_set,
	});
export var get_tasks = ({ filters = {}, global_data }) =>
	get_collection({
		collection_name: "tasks",
		filters,
		global_data,
	});
export var update_user = ({ kind, new_value, user_id }) => {
	var update_set = {};
	update_set[kind] = new_value;
	return update_document({
		collection: "users",
		update_filter: {
			_id: user_id,
		},
		update_set,
	});
};

export var flexible_user_finder = async ({ value }) =>
	//this one search for that value in all of these values : user_ids, usernames, email_addresses, mobiles
	//and returns that user which matches
	await custom_axios({
		task: "flexible_user_finder",
		body: {
			value,
		},
	});
export var get_resources = ({ filters = {}, global_data }) =>
	get_collection({
		collection_name: "resources",
		filters,
		global_data,
	});
export var custom_axios_download = async ({ configured_axios, url }) => {
    var response = await configured_axios({
        url,
        method: "GET",
        responseType: "blob",
    })
    // create file link in browser's memory
    const href = URL.createObjectURL(response.data)

    // create "a" HTML element with href to file & click
    const link = document.createElement("a")
    link.href = href
    link.toggleAttribute("download", "")
    document.body.appendChild(link)
    link.click()

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
}

export var new_comment = ({ date, text, user_id, context, id }) =>
	new_document({
		collection_name: "comments",
		document: { date, text, user_id, context, id },
	});

export var get_comments = ({ filters, global_data }) =>
	get_collection({
		collection_name: "comments",
		filters,
		global_data,
	});

export var delete_comment = ({ filters }) =>
	delete_document({
		collection_name: "comments",
		filters,
	});

export var edit_comment = ({ new_text, comment_id }) =>
	update_document({
		collection: "comments",
		update_filter: {
			_id: comment_id,
		},
		update_set: {
			text: new_text,
			edited: true,
		},
	});
export var leave_here = async ({ context_id, context, user_id, global_data }) => {
	//how to use it : if a user with id = 'foo' wants to leave a
	//pack with id = 'bar' => context : "packs", context_id : 'bar' , user_id = 'foo'
	var tmp = (
		await get_collection({
			global_data,
			collection_name: context,
			filters: { _id: context_id },
		})
	)[0]["collaborators"];
	await update_document({
		collection: context,
		update_filter: {
			_id: context_id,
		},
		update_set: {
			collaborators: tmp.filter((i) => i.user_id !== user_id),
		},
	});
};

export var custom_delete = async ({ context, id }) =>
	await custom_axios({
		body: {
			context,
			id,
		},
		task: "custom_delete",
	});
