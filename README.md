# webcase

## Módulo Webservice

### GET
deberá mostrar la suma, el máximo, el mínimo, el valor medio y los valores únicos para los datos consultados.

Las consultas que se harán al WS serán de dos tipos:
	- Número de personas (suma, media, máximo y mínimo) desglosado por edad
	- Número de personas (suma, media, máximo y mínimo) desglosado por ciudad y edad
	- Número de personas (suma, media, máximo y mínimo) desglosado por ciudad
	- Número de personas desglosado por ciudad (y edad) según el último registro de cada una.

### POST
el webservice deberá generar un trabajo con la información recibida en una cola de trabajo.

### PUT
el webservice deberá generar un trabajo con la información recibida en una cola de trabajo.

## Modelo de datos
```
{
	"ts": 1429521853000,
	"city": "Madrid",
	"population": [
		{"age":20, "count": 1000},
		{"age":24, "count": 1343},
		{"age":37, "count": 100},
		{"age":50, "count": 2000}
	]
}
```

## Requisitos
- MongoDB como base de datos
- NodeJS como plataforma de desarrollo
- Consultas a la base de datos mediante la función "aggregate"
- Clusteres en paralelo, con máximo de 10 hilos en paralelo.