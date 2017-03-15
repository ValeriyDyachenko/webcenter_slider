# webcenter_slider

Еще один слайдер. Создан для безболезненной интеграции в верстку. Имеет минимум стилей. Есть возможность подключить внешние элементы управления.

Необходим jQuery. Для использования подключить js файл и стили.

Пример инициализации:

	var my_slider = new webcenter_slider({
		selector: '.some_class',
		right: '.right_arrow', 
		left: '.left_arrow', 
		mode: 'infinite', // есть еще standard
		step: '290px', // шаг пролистывания в пикселях
		width: '350px' // ширина слайдера
	});
  
Из неочевидного здесь параметр mode, который принимает infinite - бесконечный режим прокрутки или standard - остановиться в конце.
  
Так же имеется небольшой помощник - объект wcHelper.

wcHelper.noSelect('.right_arrow'); 
Теперь при кликах на данный элемент не будет происходить выделения элементов в браузере.


----------------------------------------------------


Another slider. It was created for painless integration into layout. Has a minimum of styles. It is possible to connect external controls.

Requires jQuery. To use, connect the js file and styles.

Initialization example:

	var my_slider = new webcenter_slider({
		selector: '.some_class',
		right: '.right_arrow', 
		left: '.left_arrow', 
		mode: 'infinite', 
		step: '290px', 
		width: '350px' 
	});
  
  From the non-obvious here mode parameter, which takes infinite - infinite scrolling mode or standard - to stop at the end.
  
  
There is also a small helper - the wcHelper object.

WcHelper.noSelect ('. Right_arrow');
Now when clicks on this element there will be no selection of items in the browser.
