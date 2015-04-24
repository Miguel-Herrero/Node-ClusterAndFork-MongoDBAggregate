# webCASE
URL: [https://webcase-miguel-herrero.c9.io/](https://webcase-miguel-herrero.c9.io/)

## GET /test
Es una página de prueba para hacer los tests de estrés sin el cuello de botella de la conexión a la base de datos.

## GET /population/cities
Devuelve una lista de todas las ciudades (orden alfabético), con las estadísticas de cada una:

- **_id**: nombre de la ciudad
- **sum**: total de ciudadanos
- **avg**: edad media de todos los ciudadanos
- **max**: edad máxima de todos los ciudadanos
- **min**: edad mínima de todos los ciudadanos

###Respuesta
**Status**: `200 OK`

**Body**:

    [
        {
            "_id": "Londres",
            "sum": 15,
            "avg": 120,
            "max": 120,
            "min": 120
        }
    ]

## GET /population/ages
Devuelve las estadísticas de todas las edades, y el total por cada una:

- **sum**: total de ciudadanos registrados
- **avg**: edad media de todos los ciudadanos
- **max**: edad máxima registrada
- **min**: edad mínima registrada
- **statsPerAge**: edad y el número total de ciudadanos (orden descendente de edad)

###Respuesta
**Status**: `200 OK`

**Body**:

    {
        "_id": 0,
        "sum": 13357,
        "avg": 70,
        "max": 120,
        "min": 20,
        "statsPerAge": [
            {
                "_id": 120,
                "sum": 31
            }
        ]
    }

## GET /population/both
Devuelve un listado de ciudades, con las estadísticas de cada una, y un listado de las edades de cada una:

- **_id**: nombre de la ciudad
- **sum**: total de ciudadanos de esa ciudad
- **avg**: edad media de los ciudadanos de esa ciudad
- **max**: edad máxima registrada en esa ciudad
- **min**: edad mínima registrada en esa ciudad
- **ages**: edades y número de ciudadanos (orden descendente de edad)

###Respuesta
**Status**: `200 OK`

**Body**:

    [
        {
            "_id": "Valencia",
            "sum": 4443,
            "avg": 32.5,
            "max": 50,
            "min": 20,
            "ages": [
                {
                    "_id": 50,
                    "sum": 2000
                }
            ]
        
    ]

## GET /population/both_last
Devuelve un listado de ciudades con las edades de cada una, pero devolviendo sólo el último registro de cada una de ellas:

- **city**: ciudad (orden alfabético)
- **population**: edades y número de ciudadanos

**_Nota_**: Como los datos devueltos son muy similares a `/population/both`, me he centrado en devolver sólo los últimos registros de cada ciudad con el _aggregate_.

###Respuesta
**Status**: `200 OK`

**Body**:

    [
        {
            "city": "Londres",
            "population": [
                {
                    "age": 120,
                    "count": 15
                }
            ]
        }
    ]

## POST /population/
Inserta datos en la BD, metiéndose en una cola de trabajo asíncrona.

_**Notas:**_

- Los _timestamps_ de la BD son generados mediante el ObjectID, por lo que tienen el formato ISO 8601.

###Entrada:
**Tipo**: `application/json`

**Formato**:

    {
    	"city": "Londres",
    	"population": [
			{
			    "age":120,
			    "count": 15
			}
    	]
	}

###Respuesta:
**Status**: `200 OK`

**Body**: "La tarea de INSERT POPULATION ha acabado"

## Clústeres
- Cuando la carga de trabajo por clúster aumenta de **60 peticiones/segundo** (valor arbitrario _threshold_ que he dado yo), se van abriendo nuevos clústeres. (_thresholdCapability = workers * threshold_)
- Se abren un máximo de **tantos clústeres como núcleos tenga la CPU** del servidor (máximo recomendado).
- Cuando la carga de trabajo disminuye, se van cerrando clústeres hasta dejar **como mínimo uno activo**.
- **warning**: cuando se abren más de 10 _workers_ (aunque se hayan cerrado los anteriores previamente), se emite un aviso de que hay demasiados EventEmmiter. No he conseguido solucionarlo por ahora.
- Se han hecho pruebas de estrés rudimentarias ([ver carpeta tests](https://github.com/Miguel-Herrero/webcase/tree/master/tests)) y la creación/finalización de workers ha funcionado. Sin embargo creo que el cuello de botella es la conexión a la BD ([https://mongolab.com/](https://mongolab.com/))