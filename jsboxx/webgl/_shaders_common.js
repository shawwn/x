"use strict";

var bxx_shader_includes = {};

bxx_shader_includes.colors = ["",

"vec4 RGBA_to_HSLA(float r, float g, float b, float a)",
"{",
"	float cmin = min(r, min(g, b));",
"	float cmax = max(r, max(g, b));",
"	float delta = cmax - cmin;",
"	float l = (cmin + cmax) / 2.0;",
"	float s = 0.0;",
"	if (l > 0.0 && l < 1.0)",
"	{",
"		s = delta / (l < 0.5 ? (2.0 * l) : (2.0 - 2.0 * l));",
"	}",
"	float h = 0.0;",
"	if (delta > 0.0)",
"	{",
"		if (cmax == r && cmax != g) h += (g - b) / delta;",
"		if (cmax == g && cmax != b) h += (2.0 + (b - r) / delta);",
"		if (cmax == b && cmax != r) h += (4.0 + (r - g) / delta);",
"		h /= 6.0;",
"	}",
"	return vec4(h*360.0, s, l, a);",
"}",
"",

"vec4 HSLA_to_RGBA(float h, float s, float l, float a)",
"{",
"	h = mod(h, 360.0) / 360.0;",
"	float r=0.0,g=0.0,b=0.0;",
"	float temp1,temp2;",
" 	 if(l==0.0)",
"	 {",
"		r=g=b=0.0;",
"	 }",
"	 else",
"	 {",
"		if(a==0.0)",
"		{",
"		   r=g=b=l;",
"		}",
"		else",
"		{",
"		   temp2 = ((l<=0.5) ? l*(1.0+s) : l+s-(l*s));",
"		   temp1 = 2.0*l-temp2;",
"		   vec3 t3 = vec3(h+1.0/3.0,h,h-1.0/3.0);",
"		   vec3 clr = vec3(0,0,0);",
"		   for(int i=0;i<3;i++)",
"		   {",
"			  if(t3[i]<0.0)",
"				 t3[i]+=1.0;",
"			  if(t3[i]>1.0)",
"				 t3[i]-=1.0;",
"			  if(6.0*t3[i] < 1.0)",
"				 clr[i]=temp1+(temp2-temp1)*t3[i]*6.0;",
"			  else if(2.0*t3[i] < 1.0)",
"				 clr[i]=temp2;",
"			  else if(3.0*t3[i] < 2.0)",
"				 clr[i]=(temp1+(temp2-temp1)*((2.0/3.0)-t3[i])*6.0);",
"			  else",
"				 clr[i]=temp1;",
"		   }",
"		   r=clr[0];",
"		   g=clr[1];",
"		   b=clr[2];",
"		}",
"	 }",
"	 return vec4(r, g, b, a);",
"}",

""].join('\n');


bxx_shader_includes.random = (function () {/*
	float simple_rand(vec2 co){
	  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

bxx_shader_includes.angles = (function () {/*
#define PI 3.1415926535897932384626433832795

vec2 angle_to_vec2(float angle)
{
	return vec2(cos(angle * PI / 180.0), sin(angle * PI / 180.0));
}

float xy_to_angle(float x, float y)
{
	return mod((180.0 / PI) * atan(y, x), 360.0);
}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

/*

bxx_shader_includes.__ = ["",

""].join('\n');

*/