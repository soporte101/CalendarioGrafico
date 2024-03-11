export async function consumirDatosEventos() {
    const folder = "CalendarioEventos",
        params = ["ID", "Description", "EventDate", "EndDate", "Url", "Title", "Imagen"];

    let ulrFetch = `${location.protocol}//${location.host}/_api/web/lists/getbytitle('${folder}')/items?$select=*`;

    try {
        let data = await fetch(ulrFetch, {
            method: "GET",
            headers: {
                Accept: "application/json; odata=verbose",
            },
        });
        let resp = await data.json();
        
        return resp;
    } catch (error) {

    }
};


export async function consumirDatosEventosFiltrado(ID) {
    const folder = "CalendarioEventos",
        params = ["ID", "Description", "EventDate", "EndDate", "Url", "Title", "Imagen"];

    let ulrFetch = `${location.protocol}//${location.host}/_api/web/lists/getbytitle('${folder}')/items?$select=*&$filter=ID eq '${ID}'`;

    try {
        let data = await fetch(ulrFetch, {
            method: "GET",
            headers: {
                Accept: "application/json; odata=verbose",
            },
        });
        let resp = await data.json();

        return resp;
    } catch (error) {

    }
};