import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
    const { data, error } = useData();
    const [type, setType] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    // Mise à jour de la fonction filteredEvents
    // Le code original a été modifié pour deux raisons :
    // 1. Le code original ne filtrait pas les événements par type lorsqu'un type était sélectionné. 
    // Cela a été corrigé en ajoutant une opération de filtrage qui filtre les événements par type 
    // lorsque 'type' n'est pas null ou indéfini.
    // 2. Le code original ne triait pas les événements par date. 
    // Cela a été corrigé en ajoutant une opération de tri qui trie les événements par ordre décroissant de date.
    const filteredEvents = (
        (!type
            ? data?.events
            : data?.events.filter((event) => event.type === type)) || []
    )
        .sort((evtA, evtB) =>
            new Date(evtA.date) < new Date(evtB.date) ? 1 : -1
        )
        .filter((event, index) => {
            if (
                (currentPage - 1) * PER_PAGE <= index &&
                PER_PAGE * currentPage > index
            ) {
                return true;
            }
            return false;
        });

    const changeType = (evtType) => {
        setCurrentPage(1);
        setType(evtType);
    };

    const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
    const typeList = new Set(data?.events.map((event) => event.type));

    return (
        <>
            {error && <div>An error occured</div>}
            {data === null ? (
                "loading"
            ) : (
                <>
                    <h3 className="SelectTitle">Catégories</h3>

                    <Select
                        selection={Array.from(typeList)}
                        onChange={(value) =>
                            value ? changeType(value) : changeType(null)
                        }
                    />

                    <div id="events" className="ListContainer">
                        {filteredEvents.map((event) => (
                            <Modal
                                key={event.id}
                                Content={<ModalEvent event={event} />}
                            >
                                {({ setIsOpened }) => (
                                    <EventCard
                                        onClick={() => setIsOpened(true)}
                                        imageSrc={event.cover}
                                        title={event.title}
                                        date={new Date(event.date)}
                                        label={event.type}
                                    />
                                )}
                            </Modal>
                        ))}
                    </div>
                    <div className="Pagination">
                        {[...Array(pageNumber || 0)].map((_, n) => (
                            <a
                                // eslint-disable-next-line react/no-array-index-key
                                key={n}
                                href="#events"
                                onClick={() => setCurrentPage(n + 1)}
                            >
                                {n + 1}
                            </a>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default EventList;
