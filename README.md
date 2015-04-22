# webCASE
URL: [https://webcase-miguel-herrero.c9.io/](https://webcase-miguel-herrero.c9.io/)

## GET /population/cities
Devuelve una lista de todas las ciudades (orden alfabético), con las estadísticas de cada una:

- sum: total de ciudadanos
- avg: edad media de todos los ciudadanos
- max: edad máxima de todos los ciudadanos
- min: edad mínima de todos los ciudadanos

## GET /population/ages
Devuelve las estadísticas de todas las edades, y el total por cada una:

- sum: total de ciudadanos
- avg: edad media de todos los ciudadanos
- max: edad máxima registrada
- min: edad mínima registrada
- statsPerAge: edad y el número total de ciudadanos (orden descendente de edad)

## GET /population/both
Devuelve un listado de ciudades, con las estadísticas de cada una, y un listado de las edades de cada una:

- sum: total de ciudadanos de esa ciudad
- avg: edad media de los ciudadanos de esa ciudad
- max: edad máxima registrada en esa ciudad
- min: edad mínima registrada en esa ciudad
- ages: edades y número de ciudadanos (orden descendente de edad)

## GET /population/both_last
Devuelve un listado de ciudades con las edades de cada una, pero devolviendo sólo el último registro de cada una de ellas:

- city: ciudad (orden alfabético)
- population: edades y número de ciudadanos

## POST /population/
Inserta datos en la BD, metiéndose en una cola de trabajo asíncrona.

###Entrada:
**Tipo**: application/json

**Formato**:

    {
    	"city": "Londres",
    	"population": [
			{"age":120, "count": 15}
    	]
	}

###Respuesta:
**Status**: 200

**Body**: "La tarea de INSERT POPULATION ha acabado"

## Notas
- Los timestamps de la BD son generados mediante el ObjectID, por lo que tienen el formato ISO 8601
- Máximo 10 clústeres en paralelo, generándose/cerrándose según la carga de trabajo.