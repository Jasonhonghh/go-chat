package log

import (
	"github.com/sirupsen/logrus"
)

var LOG *logrus.Logger

func Init(logLevel string) {
	LOG = logrus.New()

	switch logLevel {
	case "debug":
		LOG.SetLevel(logrus.DebugLevel)
	case "info":
		LOG.SetLevel(logrus.InfoLevel)
	case "warn":
		LOG.SetLevel(logrus.WarnLevel)
	case "error":
		LOG.SetLevel(logrus.ErrorLevel)
	default:
		LOG.SetLevel(logrus.TraceLevel)
	}

	LOG.SetFormatter(&logrus.TextFormatter{
		DisableColors: false,
		FullTimestamp: true,
		PadLevelText:  true,
	})
	LOG.SetReportCaller(true)
}
