import PropTypes from "prop-types";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const DataContext = createContext({});

export const api = {
    loadData: async () => {
        const json = await fetch("/events.json");
        return json.json();
    },
};

export const DataProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    // Ajout d'un nouvel état pour stocker le dernier événement
    const [last, setLast] = useState(null);

    const getData = useCallback(async () => {
        try {
            const fetchedData = await api.loadData();
            setData(fetchedData);

            // Ajout d'une logique pour déterminer le dernier événement
            // Rajout d'une fonction reduce qui vérifie la date de chaque événement 
            // et conserve le plus récent.
            const lastEvent = fetchedData?.events?.length
                ? fetchedData.events.reduce((latest, current) =>
                      new Date(current.date) > new Date(latest.date)
                          ? current
                          : latest
                  )
                : null;
                
            // Mise à jour de l'état du dernier événement
            setLast(lastEvent);

        } catch (err) {
            setError(err);
        }
    }, []);

    useEffect(() => {
        if (data) return;
        getData();
    }, [data, getData]);

    return (
        <DataContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                data,
                error,

                // Mise à jour du code pour inclure 'last' dans la valeur du contexte. 
                // Cela permet aux composants qui consomment ce contexte d'accéder au dernier événement.
                last,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
