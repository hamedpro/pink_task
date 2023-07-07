import React, { useContext } from "react"

import { Section } from "./section"
import { useNavigate } from "react-router-dom"
import { custom_editorjs_to_jsx } from "../../jsx_helpers.jsx"
import ObjectBox from "./ObjectBox"
import { UnifiedHandlerClientContext } from "../UnifiedHandlerClientContext"
function PackViewNote({ cache_item }) {
    var { strings } = useContext(UnifiedHandlerClientContext)
    var nav = useNavigate()

    return (
        <Section
            title={`${strings[81]} ${cache_item.thing_id}`}
            onClick={() => nav(`/dashboard/${cache_item.thing_id}`)}
            className="cursor-pointer "
        >
            <p>
                {strings[82]} : {cache_item.thing.value.title}
            </p>
            {/* <p>collaborators :</p>
			<ol>
				{note.collaborators.map((c) => (
					<li
						key={c.user_id}
						onClick={(e) => {
							e.stopPropagation();
							nav(`/users/${c.user_id}`);
						}}
					>
						user #{c.user_id}
					</li>
				))}
			</ol> */}

            <hr />
            {cache_item.thing.value.data ? (
                custom_editorjs_to_jsx(cache_item.thing.value.data)
            ) : (
                <h1>{strings[83](cache_item.thing_id)}</h1>
            )}
        </Section>
    )
}
function PackViewResource({ cache_item }) {
    var { strings } = useContext(UnifiedHandlerClientContext)
    var nav = useNavigate()
    return (
        <Section
            title={`${strings[84]} #${cache_item.thing_id}`}
            onClick={() => nav(`/dashboard/${cache_item.thing_id}`)}
            className="cursor-pointer "
        >
            <p>
                {strings[82]} : {cache_item.thing.value.title}
            </p>
            {/* <p>collaborators :</p>
			<ol>
				{resource.collaborators.map((c) => (
					<li
						key={c.user_id}
						onClick={(e) => {
							e.stopPropagation();
							nav(`/users/${c.user_id}`);
						}}
					>
						user #{c.user_id}
					</li>
				))}
			</ol> */}
            <p>
                {strings[73]} {cache_item.thing.value.description}
            </p>
        </Section>
    )
}
function PackViewTask({ cache_item }) {
    var { strings } = useContext(UnifiedHandlerClientContext)
    var nav = useNavigate()
    return (
        <Section
            title={`${strings[85]} #${cache_item.thing_id}`}
            onClick={() => nav(`/dashboard/${cache_item.thing_id}`)}
            className="cursor-pointer "
        >
            <p>
                {strings[82]} : {cache_item.thing.value.title}
            </p>
            {/* <p>collaborators :</p>
			<ol>
				{task.collaborators.map((c) => (
					<li
						key={c.user_id}
						onClick={(e) => {
							e.stopPropagation();
							nav(`/users/${c.user_id}`);
						}}
					>
						user #{c.user_id}
					</li>
				))}
			</ol> */}
            <p>
                {strings[73]} {cache_item.thing.value.description}
            </p>
        </Section>
    )
}
function PackViewPack({ cache_item }) {
    //its used to show an overview of a pack inside another pack
    var nav = useNavigate()
    var { strings } = useContext(UnifiedHandlerClientContext)
    return (
        <Section
            title={`${strings[86]} #${cache_item.thing_id}`}
            onClick={() => nav(`/dashboard/${cache_item.thing_id}`)}
            className="cursor-pointer "
        >
            <p>
                {strings[82]} : {cache_item.thing.value.title}
            </p>
            {/* <p>collaborators :</p>
			<ol>
				{pack.collaborators.map((c) => (
					<li
						key={c.user_id}
						onClick={(e) => {
							e.stopPropagation();
							nav(`/users/${c.user_id}`);
						}}
					>
						user #{c.user_id}
					</li>
				))}
			</ol> */}
            <p>
                {strings[73]} {cache_item.thing.value.description}
            </p>

            {/* <ol>
				<li>
					it contains {}{" "}
					direct packs
				</li>
				<li>
					it contains {global_data.all.notes.filter((i) => i.pack_id === pack._id).length}{" "}
					direct notes
				</li>
				<li>
					it contains{" "}
					{global_data.all.resources.filter((i) => i.pack_id === pack._id).length} direct
					resources
				</li>
				<li>
					it contains {global_data.all.tasks.filter((i) => i.pack_id === pack._id).length}{" "}
					direct tasks
				</li>
			</ol> */}
        </Section>
    )
}
function PackViewItem({ cache_item }) {
    if (cache_item.thing.type === "unit/pack") {
        return <PackViewPack cache_item={cache_item} />
    } else if (cache_item.thing.type === "unit/task") {
        return <PackViewTask cache_item={cache_item} />
    } else if (cache_item.thing.type === "unit/resource") {
        return <PackViewResource cache_item={cache_item} />
    } else if (cache_item.thing.type === "unit/note") {
        return <PackViewNote cache_item={cache_item} />
    } else {
        return <ObjectBox object={cache_item} />
    }
}
function GroupedPackView({ cache_items }) {
    var { strings } = useContext(UnifiedHandlerClientContext)
    return (
        <>
            <Section title={strings[87]}>
                {cache_items.filter((i) => i.thing.type === "unit/pack")
                    .length === 0 && <h1>{strings[88]("pack")}</h1>}
                {cache_items
                    .filter((i) => i.thing.type === "unit/pack")
                    .map((i) => (
                        <PackViewItem cache_item={i} key={i.thing_id} />
                    ))}
            </Section>
            <Section title={strings[89]}>
                {cache_items.filter((i) => i.thing.type === "unit/task")
                    .length === 0 && <h1>{strings[88]("task")}</h1>}
                {cache_items
                    .filter((i) => i.thing.type === "unit/task")
                    .map((i) => (
                        <PackViewItem cache_item={i} key={i.thing_id} />
                    ))}
            </Section>
            <Section title="notes">
                {cache_items.filter((i) => i.thing.type === "unit/note")
                    .length === 0 && <h1>{strings[88]("note")}</h1>}
                {cache_items
                    .filter((i) => i.thing.type === "unit/note")
                    .map((i) => (
                        <PackViewItem cache_item={i} key={i.thing_id} />
                    ))}
            </Section>
            <Section title="resources">
                {cache_items.filter((i) => i.thing.type === "unit/resource")
                    .length === 0 && <h1>{strings[88]("resource")}</h1>}
                {cache_items
                    .filter((i) => i.thing.type === "unit/resource")
                    .map((i) => (
                        <PackViewItem cache_item={i} key={i.thing_id} />
                    ))}
            </Section>
            <Section title="events">
                {cache_items.filter((i) => i.thing.type === "unit/evnet")
                    .length === 0 && <h1>{strings[88]("event")}</h1>}
                {cache_items
                    .filter((i) => i.thing.type === "unit/evnet")
                    .map((i) => (
                        <PackViewItem cache_item={i} key={i.thing_id} />
                    ))}
            </Section>
            <Section title="asks">
                {cache_items.filter((i) => i.thing.type === "unit/ask")
                    .length === 0 && <h1>{strings[88]("ask")}</h1>}
                {cache_items
                    .filter((i) => i.thing.type === "unit/ask")
                    .map((i) => (
                        <PackViewItem cache_item={i} key={i.thing_id} />
                    ))}
            </Section>
        </>
    )
}
function CustomPackView({ cache_items }) {
    return cache_items.map((cache_item) => {
        return (
            <PackViewItem key={cache_item.thing_id} cache_item={cache_item} />
        )
    })
}
export const PackView = ({
    pack_children,
    view_as_groups = false,
    sort,
    cache,
}) => {
    var { strings } = useContext(UnifiedHandlerClientContext)
    var sorted_pack_children = pack_children.sort((i1, i2) => {
        if (sort === "timestamp_desc") {
            return (
                uhc.find_first_transaction(i1).time -
                uhc.find_first_transaction(i2).time
            )
        } else if (sort === "timestamp_asce") {
            return (
                -uhc.find_first_transaction(i1).time -
                uhc.find_first_transaction(i2).time
            )
        }
    })
    return (
        <div className="border border-blue-400 mt-2">
            <div className="flex justify-between mb-1 items-center">
                <h1>
                    {view_as_groups ? strings[90] : strings[91]}{" "}
                    {sort === "timestamp_asce" && strings[92]}
                    {sort === "timestamp_desc" && strings[93]}
                </h1>
                <button
                    className="items-center flex"
                    onClick={(event) => show({ event })}
                >
                    <i className="bi-list text-lg" />{" "}
                </button>
            </div>

            {view_as_groups !== true ? (
                <CustomPackView
                    cache_items={sorted_pack_children.map((i) =>
                        cache.find((j) => j.thing_id === i)
                    )}
                />
            ) : (
                <GroupedPackView
                    cache_items={sorted_pack_children.map((i) =>
                        cache.find((j) => j.thing_id === i)
                    )}
                />
            )}
        </div>
    )
}
