<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:fo="http://www.w3.org/1999/XSL/Format"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<xsl:output omit-xml-declaration="true" method="text" indent="no"/>
<xsl:template match="/"><xsl:apply-templates select="//table"/></xsl:template>
<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="span"><xsl:apply-templates select="*|text()"/></xsl:template>
<!-- =====================================-->
		

<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="table"><xsl:apply-templates select="tbody"/></xsl:template>
<!-- =====================================-->


<!-- =====================================-->
<xsl:template match="tbody"><xsl:apply-templates select="tr"/></xsl:template>
<!-- =====================================-->


<!-- =====================================-->
<xsl:template match="tr"><xsl:apply-templates select="td[not(contains(@style,'none'))]"/>;
</xsl:template>
<!-- =====================================-->
			

<!-- =====================================-->
<xsl:template match="td"><xsl:if test="position()&gt;1">;</xsl:if><xsl:apply-templates select="span"/></xsl:template>
<!-- =====================================-->
			

</xsl:stylesheet>